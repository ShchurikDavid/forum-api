import type { Repository } from '../domain/post/repository.js';
import type { db as database } from '../prisma/db.js';

export function createPostRepository(db: typeof database): Repository {
  const posts = db.orm.public.Post;

  return {
    async getAll(category, take, categoryId) {
      let query = posts.orderBy((post) => post.id.asc());

      if (category) {
        const found = await db.orm.public.Category.where({ name: category }).first();
        if (!found) return [];
        query = query.where({ categoryId: found.id });
      }
      if (categoryId !== undefined) query = query.where({ categoryId });
      if (take !== undefined) {
        query = query.limit(take);
      }
      return await query.include('category').all();
    },
    async getById(id) {
      return (await posts.where({ id }).include('category').first()) ?? undefined;
    },
    async addPost({ title, content, author, categoryId }) {
      const created = await posts.create({ title, content, author, category: category => category.connect({ id: categoryId }) });
      return (await posts.where({ id: created.id }).include('category').first())!;
    },
  };
}
