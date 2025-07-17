import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery, setSort, setOrder, setIsTyping } from '../../slices/searchSlice';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { AppDispatch } from '../../../../app/store';

/**
 * Компонент для поиска репозиториев GitHub.
 * 
 * @component
 * @example
 * return (
 *   <RepositorySearch />
 * )
 */
const RepositorySearch: React.FC = () => {
    /**
     * Состояние для хранения текущего значения поискового запроса.
     * @type {string}
     */
    const [searchValue, setSearchValue] = useState('');

    /**
     * Хук для доступа к dispatch-функции Redux.
     * Используется для отправки actions в store.
     * @type {AppDispatch}
     */
    const dispatch = useDispatch<AppDispatch>();

    /**
     * Эффект, который срабатывает при изменении searchValue.
     * Устанавливает флаг isTyping в true при начале ввода,
     * затем через debounce (500ms) отправляет поисковый запрос в Redux store
     * и сбрасывает флаг isTyping.
     * Также сбрасывает таймер и флаг isTyping при размонтировании компонента.
     */
    useEffect(() => {
        // Устанавливаем флаг, что пользователь начал ввод
        dispatch(setIsTyping(true));

        // Запускаем таймер для debounce-эффекта
        const timer = setTimeout(() => {
            // Если поисковый запрос не пустой
            if (searchValue.trim()) {
                // Отправляем запрос в Redux store
                dispatch(setQuery(searchValue));
                // Устанавливаем сортировку по звёздам
                dispatch(setSort('stars'));
                // Устанавливаем порядок по убыванию
                dispatch(setOrder('desc'));
            }
            // Сбрасываем флаг ввода
            dispatch(setIsTyping(false));
        }, 500);

        // Функция очистки эффекта
        return () => {
            // Очищаем таймер
            clearTimeout(timer);
            // Сбрасываем флаг ввода
            dispatch(setIsTyping(false));
        };
    }, [searchValue, dispatch]);

    /**
     * Рендер компонента.
     * Возвращает текстовое поле с возможностью ввода поискового запроса.
     */
    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск репозиториев GitHub..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default RepositorySearch;