export interface GetPostsQuery {
  category?: string;
  take?: string;
}

export interface CreatePost {
  title: string;
  content: string;
  author: string;
  category: string;
}
import type { Request } from 'express';


export interface CreatePostRequest extends Request {
  body: CreatePost;
}
