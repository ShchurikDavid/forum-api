import * as repository from '../repositories/post.js';
import type { CreatePost } from '../transport/dto/post.js';

export function getAll(category?: string, take?: number) {
  return repository.getAll(category, take);
}

export function getById(id: number) {
  return repository.getById(id);
}

export function addPost(post: CreatePost) {
  return repository.addPost(post);
}
