import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice, getDefaultMiddleware, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface Task {
  id: string;
  content: string;
  columnId: string;
};

export interface Column {
  id: number;
  name: string;
  tasks: Array<Task>;
}

export interface ColumnsState {
  columns: Array<Column>;
}

const initialState: ColumnsState = {
  columns: []
};

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getColumns: builder.query<Column[], null>({
      query: () => '/columns'
    })
  })
})

export const { useGetColumnsQuery } = api;

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return [
      ...getDefaultMiddleware(),
      api.middleware
    ];
  }
});
