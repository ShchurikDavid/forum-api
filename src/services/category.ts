import type { CategoryRepository } from '../domain/category/repository.js';
import type { CategoryService } from './category.types.js';
export function createCategoryService(repository: CategoryRepository): CategoryService {
  return {
    getAll: () => repository.getAll(),
    getById: id => repository.getById(id),
    addCategory: category => repository.addCategory({ name: category.name.trim() }),
  };
}
