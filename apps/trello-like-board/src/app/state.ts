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

export type Coords = {
  x:number;
  y:number;
}

export interface DraggingState {
  draggableItemId: string | null;
  coords: Coords | null;
}

const initialState: DraggingState = {
  draggableItemId: null,
  coords: null
}

const draggingSlice = createSlice({
  name: 'dragging',
  initialState,
  reducers: {
    dragSTop: (state, action) => {
      state.coords = action.payload.coords;
      state.draggableItemId = action.payload.draggableItemId;
    }
  }
});

export const draggingSelector = (state: RootState) => state.dragging;

export const { dragSTop } = draggingSlice.actions;

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getColumns: builder.query<Column[], null>({
      query: () => '/columns'
    }),
    getTasksByColumn: builder.query<Task[], number>({
      query: (columnId: number) => `/columns/${columnId}/tasks`
    }),
  })
})

export const { useGetColumnsQuery, useGetTasksByColumnQuery } = api;

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    dragging: draggingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return [
      ...getDefaultMiddleware(),
      api.middleware
    ];
  }
});
