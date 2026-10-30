import type { Repository } from '../domain/post/repository.js';
import type { db as database } from '../prisma/db.js';

export function createPostRepository(db: typeof database): Repository {
  const posts = db.orm.public.Post;

  const publicPost = <T extends { author: { id: number; email: string } }>(post: T) => ({
    ...post, author: { id: post.author.id, email: post.author.email },
  });

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
      return (await query.include('category').include('author').all()).map(publicPost);
    },
    async getById(id) {
      const post = await posts.where({ id }).include('category').include('author').first();
      return post ? publicPost(post) : undefined;
    },
    async addPost({ title, content, authorId, categoryId }) {
      const created = await posts.create({ title, content, author: author => author.connect({ id: authorId }), category: category => category.connect({ id: categoryId }) });
      return publicPost((await posts.where({ id: created.id }).include('category').include('author').first())!);
    },
  };
}
