import type { NewPost, Post } from './entity.js';

export interface Repository {
  getAll(category?: string, take?: number, categoryId?: number): Promise<Post[]>;
  getById(id: number): Promise<Post | undefined>;
  addPost(post: NewPost): Promise<Post>;
}

