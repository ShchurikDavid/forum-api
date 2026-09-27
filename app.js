import * as express from 'express';
import * as postRouter from './src/routers/post.js';

const app = express.default();

app.use(express.default.json());
app.use('/posts', postRouter.router);
const PORT = '3000'
const HOST = 'localhost'


app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})