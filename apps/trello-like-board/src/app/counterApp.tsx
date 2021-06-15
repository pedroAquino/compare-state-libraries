import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

interface CounterState {
  value: number;
};

const initialState: CounterState = {
  value: 0
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

const selectCount = (state: RootState) => state.counter.value;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const Counter = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const { increment, decrement } = counterSlice.actions;
  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
};