import express from 'express';
import { createPostRepository } from './src/repositories/post.js';
import { createPostService } from './src/services/post.js';
import { createPostHandlers } from './src/transport/handlers/post.js';
import { createPostRouter } from './src/transport/routers/post.js';

const app = express();
const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandlers = createPostHandlers(postService);
const postRouter = createPostRouter(postHandlers);

app.use(express.json());
app.use('/posts', postRouter);
const PORT = 3000
const HOST = 'localhost'


app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
