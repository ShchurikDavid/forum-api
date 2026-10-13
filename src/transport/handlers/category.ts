import type { Request, Response } from 'express';
import type { CategoryService } from '../../services/category.types.js';
import type { CategoryResponse } from '../dto/category/responses.js';
import type { CreateCategory } from '../dto/category/requests.js';
import type { ErrorResponse } from '../dto/post/errors.js';
import { ConflictError } from '../../domain/category/entity.js';

export function createCategoryHandlers(service: CategoryService) {
  async function getAll(_req: Request, res: Response<CategoryResponse[] | ErrorResponse>) {
    try {
      return res.json(await service.getAll());
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getById(req: Request, res: Response<CategoryResponse | ErrorResponse>) {
    try {
      const id = Number(req.params.id);
      if (typeof req.params.id !== 'string' || !Number.isInteger(id)
        || id <= 0 || String(id) !== req.params.id) {
        return res.status(400).json({ error: 'id must be a positive integer' });
      }
      const category = await service.getById(id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      return res.json(category);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function addCategory(req: Request, res: Response<CategoryResponse | ErrorResponse>) {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)
        || Object.keys(req.body).some(field => field !== 'name')
        || typeof req.body.name !== 'string' || !req.body.name.trim()) {
        return res.status(422).json({ error: 'Only a non-empty name is allowed' });
      }
      const category: CreateCategory = { name: req.body.name };
      return res.status(201).json(await service.addCategory(category));
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).json({ error: 'Category already exists' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return { getAll, getById, addCategory };
}

export type CategoryHandlers = ReturnType<typeof createCategoryHandlers>;
