import type { Repository } from '../domain/post/repository.js';
import type { Service } from './post.types.js';

export function createPostService(repository: Repository): Service {
  return {
    getAll(category, take) {
      return repository.getAll(category, take);
    },
    getById(id) {
      return repository.getById(id);
    },
    addPost(post) {
      return repository.addPost(post);
    },
  };
}

