import { NotFoundError } from '../../domain/category/entity.js';
import type { Request, Response } from 'express';
import type { Service } from '../../services/post.types.js';
import type { CreatePostRequest } from '../dto/post/requests.js';
import type { PostResponse } from '../dto/post/responses.js';
import type { ErrorResponse } from '../dto/post/errors.js';

export function createPostHandlers(service: Service) {
  async function getAll(req: Request, res: Response<PostResponse[] | ErrorResponse>) {
    try {
      const { category, categoryId, take } = req.query;
  
      if (category !== undefined
        && (typeof category !== 'string' || !category.trim())) {
        return res.status(400).json({ error: 'category must be a non-empty string' });
      }
  
      let categoryFilter: number | undefined;
      if (categoryId !== undefined) {
        categoryFilter = Number(categoryId);
        if (typeof categoryId !== 'string' || !Number.isInteger(categoryFilter)
          || categoryFilter <= 0 || String(categoryFilter) !== categoryId) {
          return res.status(400).json({ error: 'categoryId must be a positive integer' });
        }
      }

      let limit: number | undefined;

      if (take !== undefined) {
        limit = Number(take);

        if (typeof take !== 'string' || !Number.isSafeInteger(limit)
          || limit <= 0 || String(limit) !== take) {
          return res.status(400).json({ error: 'take must be a positive integer' });
        }
      }
  
      return res.json(await service.getAll(category, limit, categoryFilter));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function getById(req: Request, res: Response<PostResponse | ErrorResponse>) {
    try {
      const id = Number(req.params.id);

      if (typeof req.params.id !== 'string' || !Number.isSafeInteger(id)
        || id <= 0 || String(id) !== req.params.id) {
        return res.status(400).json({ error: 'id must be a positive integer' });
      }
  
      const post = await service.getById(id);
  
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
      const fields = ['title', 'content', 'author'] as const;
  
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)
        || Object.keys(req.body).some(field => !['title', 'content', 'author', 'categoryId'].includes(field))) {
        return res.status(422).json({ error: 'Only title, content, author and categoryId are allowed' });
      }
      if (typeof req.body.categoryId !== 'number' || !Number.isInteger(req.body.categoryId)
        || req.body.categoryId <= 0) {
        return res.status(400).json({ error: 'categoryId must be a positive integer' });
      }

      if (fields.some((field) => (
        typeof req.body[field] !== 'string' || !req.body[field].trim()
      ))) {
        return res.status(422).json({
          error: 'title, content and author must be non-empty strings',
        });
      }
  
      const post = await service.addPost(req.body);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return { getAll, getById, addPost };
}

export type PostHandlers = ReturnType<typeof createPostHandlers>;
