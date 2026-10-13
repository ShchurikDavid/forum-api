import { Router } from 'express';
import type { CategoryHandlers } from '../handlers/category.js';
export function createCategoryRouter(handlers: CategoryHandlers): Router {
  const router = Router();
  router.get('/', handlers.getAll);
  router.get('/:id', handlers.getById);
  router.post('/', handlers.addCategory);
  return router;
}
