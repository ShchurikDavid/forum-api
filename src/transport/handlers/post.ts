import type { Request, Response } from 'express';
import type { Service } from '../../services/post.types.js';
import type { CreatePostRequest } from '../dto/post/requests.js';
import type { PostResponse } from '../dto/post/responses.js';
import type { ErrorResponse } from '../dto/post/errors.js';

export function createPostHandlers(service: Service) {
  function getAll(req: Request, res: Response<PostResponse[] | ErrorResponse>) {
    try {
      const { category, take } = req.query;
  
      if (category !== undefined
        && (typeof category !== 'string' || !category.trim())) {
        return res.status(400).json({ error: 'category must be a non-empty string' });
      }
  
      let limit: number | undefined;

      if (take !== undefined) {
        limit = Number(take);

        if (typeof take !== 'string' || !Number.isSafeInteger(limit)
          || limit <= 0 || String(limit) !== take) {
          return res.status(400).json({ error: 'take must be a positive integer' });
        }
      }
  
      return res.json(service.getAll(category, limit));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  function getById(req: Request, res: Response<PostResponse | ErrorResponse>) {
    try {
      const id = Number(req.params.id);

      if (typeof req.params.id !== 'string' || !Number.isSafeInteger(id)
        || id <= 0 || String(id) !== req.params.id) {
        return res.status(400).json({ error: 'id must be a positive integer' });
      }
  
      const post = service.getById(id);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function addPost(req: CreatePostRequest, res: Response<PostResponse | ErrorResponse>) {
    try {
      const fields = ['title', 'content', 'author', 'category'] as const;
  
      if (!req.body || fields.some((field) => (
        typeof req.body[field] !== 'string' || !req.body[field].trim()
      ))) {
        return res.status(422).json({
          error: 'title, content, author and category must be non-empty strings',
        });
      }
  
      const post = await service.addPost(req.body);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return { getAll, getById, addPost };
}

export type PostHandlers = ReturnType<typeof createPostHandlers>;
