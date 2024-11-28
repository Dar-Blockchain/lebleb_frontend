// balanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {userDebt} from '../services/assets.service'; // Import your service function

// Async thunk to fetch balance
export const fetchDebt = createAsyncThunk(
  'debt/fetchDebt',
  async ({ provider, asset, symbol,reserve }, { rejectWithValue }) => {
    try {
      const balance = await userDebt(provider, asset,reserve);
      console.log(balance)
      return { symbol, balance };
    } catch (error) {
      return rejectWithValue({ symbol, error: error.message });
    }
  }
);

const debtSlice = createSlice({
  name: 'availble',
  initialState: {
    assets: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebt.fulfilled, (state, action) => {
        const { symbol, balance } = action.payload;
        state.assets[symbol] = balance;
        state.loading = false;
      })
      .addCase(fetchDebt.rejected, (state, action) => {
        const { symbol, error } = action.payload;
        state.assets[symbol] = null;
        state.error = error;
        state.loading = false;
      });
  },
});

export default debtSlice.reducer;
