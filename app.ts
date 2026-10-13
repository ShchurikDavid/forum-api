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

const app = express();
const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);
const postRepository = createPostRepository(db);
const postService = createPostService(postRepository, categoryRepository);
const postHandlers = createPostHandlers(postService);
const postRouter = createPostRouter(postHandlers);

app.use(express.json());
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
const PORT = 3000
const HOST = 'localhost'


app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
