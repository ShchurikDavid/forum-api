#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2f40eedb3e60f20343cabc23b1ca9ca9b8fbae5f5d01dde540658de4b2e08a9f/contract';
import startContract from '../../snapshots/2f40eedb3e60f20343cabc23b1ca9ca9b8fbae5f5d01dde540658de4b2e08a9f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/61b47feddc2ee80f7576e320b85a748daecb9b0ce9544b0debba562dfada3b4a/contract';
import endContract from '../../snapshots/61b47feddc2ee80f7576e320b85a748daecb9b0ce9544b0debba562dfada3b4a/contract.json' with { type: 'json' };
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
        table: 'Category',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      // Preserve every existing category name and post before dropping the text column.
      rawSql({
        id: 'backfill.Post.categoryId', label: 'Preserve existing post categories',
        operationClass: 'data', target: { id: 'postgres' }, precheck: [],
        execute: [
          { description: 'Create categories from existing names', sql: 'INSERT INTO public."Category" (name) SELECT DISTINCT category FROM public."Post"' },
          { description: 'Link existing posts', sql: 'UPDATE public."Post" p SET "categoryId" = c.id FROM public."Category" c WHERE c.name = p.category' },
        ],
        postcheck: [{ description: 'Every post keeps its category', sql: 'SELECT NOT EXISTS (SELECT 1 FROM public."Post" p LEFT JOIN public."Category" c ON c.id = p."categoryId" WHERE c.id IS NULL OR c.name <> p.category) AS result' }],
      }),
      this.dropColumn({ schema: 'public', table: 'Post', column: 'category' }),
      this.setNotNull({ schema: 'public', table: 'Post', column: 'categoryId' }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
