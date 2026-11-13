import type { NewPost, Post } from '../domain/post/entity.js';

export interface Service {
  getAll(category?: string, take?: number, categoryId?: number): Promise<Post[]>;
  getByAuthorId(authorId: number): Promise<Post[]>;
  getById(id: number): Promise<Post | undefined>;
  addPost(post: NewPost): Promise<Post>;
}

