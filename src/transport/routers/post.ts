import * as express from 'express';
import * as handler from '../handlers/post.js';

export const router = express.default.Router();

router.get('/', handler.getAll);
router.get('/:id', handler.getById);
router.post('/', handler.addPost);
