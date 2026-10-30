import type { CategoryRepository } from '../domain/category/repository.js';
import { NotFoundError } from '../domain/category/entity.js';
import type { Repository } from '../domain/post/repository.js';
import type { Service } from './post.types.js';

export function createPostService(repository: Repository, categories: CategoryRepository): Service {
  return {
    getAll(category, take, categoryId) {
      return repository.getAll(category, take, categoryId);
    },
    getById(id) {
      return repository.getById(id);
    },
    async addPost(post) {
      if (!await categories.getById(post.categoryId)) throw new NotFoundError('Category not found');
      return repository.addPost(post);
    },
  };
}

