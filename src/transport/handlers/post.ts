import type { Request, Response } from 'express';
import * as service from '../../services/post.js';

function isPositiveInteger(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number)) {
    return false;
  }

  if (number <= 0) {
    return false;
  }

  return String(number) === value;
}

export function getAll(req: Request, res: Response) {
  try {
    const { category, take } = req.query;

    if (category !== undefined
      && (typeof category !== 'string' || !category.trim())) {
      return res.status(400).json({ error: 'category must be a non-empty string' });
    }

    if (take !== undefined && !isPositiveInteger(take)) {
      return res.status(400).json({ error: 'take must be a positive integer' });
    }

    return res.json(service.getAll(category, take === undefined ? undefined : Number(take)));
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function getById(req: Request, res: Response) {
  try {
    if (!isPositiveInteger(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const post = service.getById(Number(req.params.id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addPost(req: Request, res: Response) {
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
