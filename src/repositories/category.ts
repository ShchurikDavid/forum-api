import type { CategoryRepository } from '../domain/category/repository.js';
import { ConflictError } from '../domain/category/entity.js';
import type { db as database } from '../prisma/db.js';

export function createCategoryRepository(db: typeof database): CategoryRepository {
  const categories = db.orm.public.Category;
  return {
    async getAll() { return await categories.orderBy(c => c.id.asc()).all(); },
    async getById(id) { return (await categories.where({ id }).first()) ?? undefined; },
    async addCategory(category) {
      try { return await categories.create(category); }
      catch (error) {
        if (hasDatabaseCode(error, '23505')) throw new ConflictError('Category already exists');
        throw error;
      }
    },
  };
}

function hasDatabaseCode(error: unknown, code: string): boolean {
  while (error && typeof error === 'object') {
    const value = error as { code?: string; sqlState?: string; cause?: unknown };
    if (value.code === code || value.sqlState === code) return true;
    error = value.cause;
  }
  return false;
}
