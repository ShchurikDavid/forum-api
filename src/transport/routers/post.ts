import { Router } from 'express';
import type { PostHandlers } from '../handlers/post.js';

export function createPostRouter(handlers: PostHandlers): Router {
  const router = Router();
  router.get('/', handlers.getAll);
  router.get('/:id', handlers.getById);
  router.post('/', handlers.addPost);
  return router;
}

