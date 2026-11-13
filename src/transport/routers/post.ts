import { Router, type RequestHandler } from 'express';
import type { PostHandlers } from '../handlers/post.js';

export function createPostRouter(handlers: PostHandlers, requireAuth: RequestHandler): Router {
  const router = Router();
  router.get('/', handlers.getAll);
  router.get('/my', requireAuth, handlers.getMyPosts);
  router.get('/:id', handlers.getById);
  router.post('/', handlers.addPost);
  return router;
}

