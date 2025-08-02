import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../features/selectionSlice';
import themeReducer from '../features/themeSlice';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
