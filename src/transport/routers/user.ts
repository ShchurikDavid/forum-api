import { Router } from 'express';
import type { UserHandlers } from '../handlers/user.js';

export function createUserRouter(handlers: UserHandlers): Router {
  const router = Router();
  router.post('/register', handlers.register);
  router.post('/login', handlers.login);
  return router;
}
