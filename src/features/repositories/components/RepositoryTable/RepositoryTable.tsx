import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    TablePagination,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import { setSelectedRepository, setSort, setOrder, setNextPage } from '../../slices/searchSlice';
import { useSearchRepositoriesQuery } from '../../api/repositoryApi';
import type { RootState } from '../../../../app/store';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Repository } from '../../models';

/**
 * Компонент для отображения таблицы с результатами поиска репозиториев GitHub.
 * Включает сортировку, пагинацию и выбор репозиториев.
 * 
 * @component
 * @example
 * return (
 *   <RepositoryTable />
 * )
 */
const RepositoryTable: React.FC = () => {
    /**
     * Redux dispatch функция для отправки actions
     * @type {Dispatch}
     */
    const dispatch = useDispatch();

    /**
     * Селектор для получения состояния поиска из Redux store
     * @type {object}
     * @property {string} query - Поисковый запрос
     * @property {'stars' | 'forks' | 'updated'} sort - Поле для сортировки
     * @property {'asc' | 'desc'} order - Порядок сортировки
     * @property {object} pagination - Настройки пагинации
     * @property {boolean} isTyping - Флаг активности ввода пользователем
     */
    const { query, sort, order, pagination, isTyping } = useSelector((state: RootState) => state.search);

    /**
     * RTK Query хук для поиска репозиториев
     * @type {object}
     * @property {Repository[]} data - Данные о репозиториях
     * @property {boolean} isLoading - Флаг начальной загрузки
     * @property {boolean} isFetching - Флаг загрузки данных
     */
    const { data, isLoading, isFetching } = useSearchRepositoriesQuery({
        query,
        sort,
        order,
        first: pagination.pageSize,
        after: pagination.cursor || undefined,
    }, {
        skip: !query.trim(), // Пропускаем запрос если query пустой
    });

    /**
     * Обработчик изменения сортировки таблицы
     * @param {'stars' | 'forks' | 'updated'} field - Поле для сортировки
     */
    const handleSort = (field: 'stars' | 'forks' | 'updated') => {
        if (sort === field) {
            // Инвертируем порядок сортировки если кликнули на то же поле
            dispatch(setOrder(order === 'asc' ? 'desc' : 'asc'));
        } else {
            // Устанавливаем новое поле сортировки и порядок по умолчанию
            dispatch(setSort(field));
            dispatch(setOrder('desc'));
        }
    };

    /**
     * Обработчик выбора репозитория
     * @param {Repository} repository - Выбранный репозиторий
     */
    const handleSelectRepository = (repository: Repository) => {
        dispatch(setSelectedRepository(repository));
    };

    /**
     * Обработчик изменения страницы пагинации
     * Загружает следующую страницу результатов
     */
    const handleChangePage = () => {
        if (data?.pageInfo.hasNextPage && data?.pageInfo.endCursor) {
            dispatch(setNextPage(data.pageInfo.endCursor));
        }
    };

    // Состояние загрузки (начальная загрузка, подгрузка или ввод пользователя)
    if (isLoading || isFetching || isTyping) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 300,
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress />
                <Typography>Загрузка данных...</Typography>
            </Box>
        );
    }

    // Состояние когда поисковый запрос пустой
    if (!query.trim()) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 300
            }}>
                <Typography>Введите запрос для поиска репозиториев</Typography>
            </Box>
        );
    }

    // Состояние когда нет результатов поиска
    if (data?.edges.length === 0) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 300
            }}>
                <Typography>Репозитории по вашему запросу не найдены</Typography>
            </Box>
        );
    }

    /**
     * Основной рендер таблицы с результатами
     */
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Язык</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sort === 'stars'}
                                    direction={order}
                                    onClick={() => handleSort('stars')}
                                >
                                    Звёзды
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sort === 'forks'}
                                    direction={order}
                                    onClick={() => handleSort('forks')}
                                >
                                    Форки
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sort === 'updated'}
                                    direction={order}
                                    onClick={() => handleSort('updated')}
                                >
                                    Обновлено
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.edges.map(({ node }) => (
                            <TableRow
                                hover
                                key={node.id}
                                onClick={() => handleSelectRepository(node)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{node.name}</TableCell>
                                <TableCell>{node.primaryLanguage?.name || '-'}</TableCell>
                                <TableCell>{node.stargazerCount}</TableCell>
                                <TableCell>{node.forkCount}</TableCell>
                                <TableCell>
                                    {format(new Date(node.updatedAt), 'dd MMM yyyy', {
                                        locale: ru
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {data?.pageInfo.hasNextPage && (
                <TablePagination
                    component="div"
                    count={data.repositoryCount}
                    rowsPerPage={pagination.pageSize}
                    page={pagination.cursor ? 1 : 0}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]}
                    labelDisplayedRows={() => 'Загрузить ещё'}
                />
            )}
        </Paper>
    );
};

export default RepositoryTable;