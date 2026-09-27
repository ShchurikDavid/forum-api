import express from 'express';
import * as postRouter from './src/transport/routers/post.js';

const app = express();

app.use(express.json());
app.use('/posts', postRouter.router);
const PORT = 3000
const HOST = 'localhost'


app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
