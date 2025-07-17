import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const GITHUB_API_URL = 'https://api.github.com/graphql';

/**
 * Базовая настройка API для работы с GitHub GraphQL
 */
export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_API_URL,
    prepareHeaders: (headers) => {
      // Здесь должен быть ваш GitHub Personal Access Token
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});