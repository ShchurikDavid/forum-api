import { hashPassword, comparePassword } from './src/lib/password.js';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from './src/lib/jwt.js';
import { createRequireAuth } from './src/middlewares/requireAuth.js';
import { createUserRepository } from './src/repositories/user.js';
import { createUserService } from './src/services/user.js';
import { createUserHandlers } from './src/transport/handlers/user.js';
import { createUserRouter } from './src/transport/routers/user.js';
import express from 'express';
import { db } from './src/prisma/db.js';
import { createPostRepository } from './src/repositories/post.js';
import { createPostService } from './src/services/post.js';
import { createPostHandlers } from './src/transport/handlers/post.js';
import { createPostRouter } from './src/transport/routers/post.js';

import { createCategoryRepository } from './src/repositories/category.js';
import { createCategoryService } from './src/services/category.js';
import { createCategoryHandlers } from './src/transport/handlers/category.js';
import { createCategoryRouter } from './src/transport/routers/category.js';

const requireAuth = createRequireAuth(verifyAccessToken);
const userService = createUserService(
  createUserRepository(db),
  { hash: hashPassword, verify: (hash, password) => comparePassword(password, hash) },
  { signAccessToken, signRefreshToken, verifyRefreshToken },
);
const userHandlers = createUserHandlers(userService);
const userRouter = createUserRouter(userHandlers);
const app = express();
const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);
const postRepository = createPostRepository(db);
const postService = createPostService(postRepository, categoryRepository);
const postHandlers = createPostHandlers(postService);
const postRouter = createPostRouter(postHandlers, requireAuth);

app.use(express.json());
app.get('/me', requireAuth, userHandlers.me);
app.post('/refresh', userHandlers.refresh);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
const PORT = 3000
const HOST = 'localhost'


app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
