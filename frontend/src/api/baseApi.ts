import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post } from '../types/post'

type ApiPost = Omit<Post, 'author' | 'category'> & {
  author: { id: number; email: string }
  category: { id: number; name: string }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      transformResponse: (posts: ApiPost[]) => posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author.email,
        category: post.category.name,
      })),
    }),
  }),
})

export const { useGetPostsQuery } = baseApi
