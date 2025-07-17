import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Repository, SortField, SortOrder } from '../models';

/**
 * Интерфейс состояния поиска
 * @interface
 * @property {string} query - Поисковый запрос
 * @property {SortField} sort - Поле для сортировки результатов
 * @property {SortOrder} order - Порядок сортировки (asc/desc)
 * @property {boolean} isTyping - Флаг, указывающий что пользователь вводит текст
 * @property {Repository | null} selectedRepository - Выбранный репозиторий
 * @property {object} pagination - Настройки пагинации
 * @property {string | null} pagination.cursor - Курсор для пагинации
 * @property {number} pagination.pageSize - Количество элементов на странице
 */
interface SearchState {
    query: string;
    sort: SortField;
    order: SortOrder;
    isTyping: boolean;
    selectedRepository: Repository | null;
    pagination: {
        cursor: string | null;
        pageSize: number;
    };
}

/**
 * Начальное состояние для searchSlice
 * @constant
 * @type {SearchState}
 */
const initialState: SearchState = {
    query: 'stars:>10000',
    sort: 'stars',
    order: 'desc',
    isTyping: false,
    selectedRepository: null,
    pagination: {
        cursor: null,
        pageSize: 10,
    },
};

/**
 * Создает Redux slice для управления состоянием поиска репозиториев
 * @constant
 */
export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        /**
         * Устанавливает поисковый запрос и сбрасывает пагинацию
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<string>} action - Действие с новым запросом
         */
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            state.pagination.cursor = null; // Сброс пагинации при новом запросе
        },

        /**
         * Устанавливает поле для сортировки результатов
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<SortField>} action - Действие с полем сортировки
         */
        setSort: (state, action: PayloadAction<SortField>) => {
            state.sort = action.payload;
        },

        /**
         * Устанавливает порядок сортировки (ascending/descending)
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<SortOrder>} action - Действие с порядком сортировки
         */
        setOrder: (state, action: PayloadAction<SortOrder>) => {
            state.order = action.payload;
        },

        /**
         * Устанавливает выбранный репозиторий
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<Repository | null>} action - Действие с репозиторием
         */
        setSelectedRepository: (state, action: PayloadAction<Repository | null>) => {
            state.selectedRepository = action.payload;
        },

        /**
         * Устанавливает курсор для пагинации (загрузки следующей страницы)
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<string>} action - Действие с курсором
         */
        setNextPage: (state, action: PayloadAction<string>) => {
            state.pagination.cursor = action.payload;
        },

        /**
         * Сбрасывает состояние пагинации
         * @function
         * @param {SearchState} state - Текущее состояние
         */
        resetPagination: (state) => {
            state.pagination.cursor = null;
        },

        /**
         * Устанавливает флаг isTyping (показывает что пользователь вводит текст)
         * @function
         * @param {SearchState} state - Текущее состояние
         * @param {PayloadAction<boolean>} action - Действие с флагом
         */
        setIsTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        }
    },
});

/**
 * Экспорт actions из searchSlice
 */
export const { 
    setQuery, 
    setSort, 
    setOrder, 
    setSelectedRepository, 
    setNextPage, 
    resetPagination, 
    setIsTyping 
} = searchSlice.actions;

/**
 * Экспорт reducer из searchSlice
 */
export default searchSlice.reducer;