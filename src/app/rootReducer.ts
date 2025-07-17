import { combineReducers } from '@reduxjs/toolkit';
import { repositoryApi } from '../features/repositories/api/repositoryApi';
import searchReducer from '../features/repositories/slices/searchSlice';

/**
 * Корневой редюсер приложения
 */
export const rootReducer = combineReducers({
  [repositoryApi.reducerPath]: repositoryApi.reducer,
  search: searchReducer,
});