import * as repository from '../repositories/post.js';

export function getAll(category, take) {
  return repository.getAll(category, take);
}

export function getById(id) {
  return repository.getById(id);
}

export function addPost(post) {
  return repository.addPost(post);
}
