import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../features/selectionSlice';
import themeReducer from '../features/themeSlice';
import { catApi } from '../api/catApi';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    theme: themeReducer,
    [catApi.reducerPath]: catApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catApi.middleware),
});

import { setupListeners } from '@reduxjs/toolkit/query';
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
