/**
 * Модель репозитория GitHub
 */
export interface Repository {
  id: string;
  name: string;
  description?: string | null;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  licenseInfo?: {
    name: string;
  } | null;
  primaryLanguage?: {
    name: string;
  } | null;
  url?: string;
}

/**
 * Информация о странице для пагинации
 */
export interface PageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
}

/**
 * Ответ на запрос поиска репозиториев
 */
export interface SearchRepositoriesResponse {
  repositoryCount: number;
  edges: Array<{
    node: Repository;
    cursor: string;
  }>;
  pageInfo: PageInfo;
}

/**
 * Параметры сортировки
 */
export type SortField = 'stars' | 'forks' | 'updated';
export type SortOrder = 'asc' | 'desc';

/**
 * Состояние поиска репозиториев
 */
export interface SearchState {
  query: string;
  sort: SortField;
  order: SortOrder;
  selectedRepository: Repository | null;
  pagination: {
    cursor: string | null;
    pageSize: number;
  };
}