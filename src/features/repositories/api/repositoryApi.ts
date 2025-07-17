import { githubApi } from '../../../shared/api/githubApi';
import type { Repository, SearchRepositoriesResponse } from '../models';

/**
 * Базовые типы для обработки GraphQL ответов
 */
interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Расширение API для работы с репозиториями GitHub
 */
export const repositoryApi = githubApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Поиск репозиториев по заданным параметрам
     * @param query - Поисковый запрос
     * @param sort - Поле сортировки (stars, forks, updated и т.д.)
     * @param order - Направление сортировки (asc/desc)
     * @param first - Количество результатов (по умолчанию 10)
     * @param after - Курсор для пагинации
     */
    searchRepositories: builder.query<SearchRepositoriesResponse, {
      query: string;
      sort?: 'stars' | 'forks' | 'updated' | 'help-wanted-issues';
      order?: 'asc' | 'desc';
      first?: number;
      after?: string | null;
    }>({
      query: ({ query, sort, order, first = 10, after }) => {
        // Формируем поисковую строку с параметрами
        const searchQuery = [
          query,
          sort && `sort:${sort}`,
          order && `order:${order}`
        ].filter(Boolean).join(' ');

        return {
          url: '',
          method: 'POST',
          body: {
            query: `
              query SearchRepositories($query: String!, $first: Int${after ? ', $after: String' : ''}) {
                search(query: $query, type: REPOSITORY, first: $first${after ? ', after: $after' : ''}) {
                  repositoryCount
                  edges {
                    node {
                      ... on Repository {
                        id name url description
                        stargazerCount forkCount updatedAt
                        licenseInfo { name }
                        primaryLanguage { name }
                      }
                    }
                    cursor
                  }
                  pageInfo {
                    endCursor hasNextPage
                  }
                }
              }
            `,
            variables: { query: searchQuery, first, ...(after && { after }) },
          },
        };
      },
      // Преобразование ответа сервера
      transformResponse: (response: GraphQLResponse<{ search: SearchRepositoriesResponse }>) => {
        if (response.errors) throw new Error(response.errors[0]?.message || 'GraphQL error');
        if (!response.data?.search) throw new Error('Invalid response structure');
        return response.data.search;
      },
    }),

    /**
     * Получение информации о конкретном репозитории
     * @param owner - Владелец репозитория
     * @param name - Название репозитория
     */
    getRepository: builder.query<Repository, { owner: string; name: string }>({
      query: ({ owner, name }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetRepository($owner: String!, $name: String!) {
              repository(owner: $owner, name: $name) {
                id name description
                stargazerCount forkCount updatedAt
                licenseInfo { name }
                primaryLanguage { name }
              }
            }
          `,
          variables: { owner, name },
        },
      }),
      // Преобразование ответа сервера
      transformResponse: (response: GraphQLResponse<{ repository: Repository }>) => {
        if (response.errors) throw new Error(response.errors[0]?.message || 'GraphQL error');
        if (!response.data?.repository) throw new Error('Invalid response structure');
        return response.data.repository;
      },
    }),
  }),
});

// Экспорт готовых хуков для использования в компонентах
export const {
  useSearchRepositoriesQuery,
  useLazySearchRepositoriesQuery,
  useGetRepositoryQuery
} = repositoryApi;