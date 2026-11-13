#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/61b47feddc2ee80f7576e320b85a748daecb9b0ce9544b0debba562dfada3b4a/contract';
import startContract from '../../snapshots/61b47feddc2ee80f7576e320b85a748daecb9b0ce9544b0debba562dfada3b4a/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e0bc65176bba9480bff5073c1d2ec0824fd27ff9dab49a81bc7581311d1ce83a/contract';
import endContract from '../../snapshots/e0bc65176bba9480bff5073c1d2ec0824fd27ff9dab49a81bc7581311d1ce83a/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  rawSql,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('authorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      rawSql({
        id: 'backfill.Post.authorId', label: 'Preserve existing post authors',
        operationClass: 'data', target: { id: 'postgres' }, precheck: [],
        execute: [
          { description: 'Create legacy authors without login credentials', sql: `INSERT INTO public."User" (email, password) SELECT DISTINCT author || '@legacy.invalid', '!' FROM public."Post"` },
          { description: 'Link existing posts to their authors', sql: `UPDATE public."Post" p SET "authorId" = u.id FROM public."User" u WHERE u.email = p.author || '@legacy.invalid'` },
        ],
        postcheck: [{ description: 'Every existing post retains its author', sql: `SELECT NOT EXISTS (SELECT 1 FROM public."Post" p LEFT JOIN public."User" u ON u.id = p."authorId" WHERE u.id IS NULL OR u.email <> p.author || '@legacy.invalid') AS result` }],
      }),
      this.dropColumn({ schema: 'public', table: 'Post', column: 'author' }),
      this.setNotNull({ schema: 'public', table: 'Post', column: 'authorId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
