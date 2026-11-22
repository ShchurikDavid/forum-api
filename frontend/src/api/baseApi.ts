import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post } from '../types/post'

import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth'

export type AuthFormData = LoginRequest

type ApiPost = Omit<Post, 'author' | 'category'> & {
  author: { id: number; email: string }
  category: { id: number; name: string }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
  tagTypes: ['Me'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: '/users/register', method: 'POST', body }),
    }),
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/users/login', method: 'POST', body }),
      invalidatesTags: ['Me'],
    }),
    getMe: builder.query<RegisterResponse, void>({
      query: () => '/me',
      providesTags: ['Me'],
    }),
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

export const { useGetPostsQuery, useRegisterUserMutation, useLoginUserMutation, useGetMeQuery } = baseApi
