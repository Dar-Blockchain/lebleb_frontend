// balanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {balanceOf} from '../services/assets.service'; // Import your service function

// Async thunk to fetch balance
export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async ({ provider, asset, symbol }, { rejectWithValue }) => {
    try {
      const balance = await balanceOf(provider, asset);
      console.log(balance)
      return { symbol, balance };
    } catch (error) {
      return rejectWithValue({ symbol, error: error.message });
    }
  }
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    assets: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        const { symbol, balance } = action.payload;
        state.assets[symbol] = balance;
        state.loading = false;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        const { symbol, error } = action.payload;
        state.assets[symbol] = null;
        state.error = error;
        state.loading = false;
      });
  },
});

export default balanceSlice.reducer;
