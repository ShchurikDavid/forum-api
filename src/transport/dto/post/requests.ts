export interface GetPostsQuery {
  category?: string;
  categoryId?: string;
  take?: string;
}

export interface CreatePost {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}
import type { Request } from 'express';


export interface CreatePostRequest extends Request {
  body: CreatePost;
}
