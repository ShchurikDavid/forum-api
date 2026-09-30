import type { NewPost, Post } from '../domain/post/entity.js';

export interface Service {
  getAll(category?: string, take?: number): Post[];
  getById(id: number): Post | undefined;
  addPost(post: NewPost): Promise<Post>;
}

