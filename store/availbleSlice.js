// balanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {availble} from '../services/assets.service'; // Import your service function

// Async thunk to fetch balance
export const fetchAvailble = createAsyncThunk(
  'availble/availbleBalance',
  async ({ provider, asset, symbol,reserve }, { rejectWithValue }) => {
    try {
      const balance = await availble(provider, asset,reserve);
      console.log(balance)
      return { symbol, balance };
    } catch (error) {
      return rejectWithValue({ symbol, error: error.message });
    }
  }
);

const availbleSlice = createSlice({
  name: 'availble',
  initialState: {
    assets: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailble.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailble.fulfilled, (state, action) => {
        const { symbol, balance } = action.payload;
        state.assets[symbol] = balance;
        state.loading = false;
      })
      .addCase(fetchAvailble.rejected, (state, action) => {
        const { symbol, error } = action.payload;
        state.assets[symbol] = null;
        state.error = error;
        state.loading = false;
      });
  },
});

export default availbleSlice.reducer;
