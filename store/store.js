// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import balanceReducer from './balanceSlice';
import  availbleReducer from './availbleSlice';
import  debtReducer from './debtSlice';


const store = configureStore({
  reducer: {
    wallet: walletReducer,
    balance:balanceReducer,
    availble:availbleReducer,
    debt:debtReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['wallet'],
      },
    }),
});

export default store;
