import type { Repository } from '../domain/post/repository.js';
import type { db as database } from '../prisma/db.js';

export function createPostRepository(db: typeof database): Repository {
  const posts = db.orm.public.Post;

  return {
    async getAll(category, take) {
      let query = posts.orderBy((post) => post.id.asc());

      if (category) {
        query = query.where({ category });
      }
      if (take !== undefined) {
        query = query.limit(take);
      }
      return await query.all();
    },
    async getById(id) {
      return (await posts.where({ id }).first()) ?? undefined;
    },
    async addPost({ title, content, author, category }) {
      return posts.create({ title, content, author, category });
    },
  };
}

