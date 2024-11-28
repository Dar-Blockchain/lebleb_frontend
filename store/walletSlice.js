import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for connecting the wallet
export const connectWallet = createAsyncThunk(
  'wallet/connectWallet',
  async (_, { rejectWithValue }) => {
    try {
      // Conditionally load getWallets on the client side
      let getWallets;
      
      if (typeof window !== 'undefined') {
        // Dynamically require the wallet provider only on the client

        let walletProvider = await import('@massalabs/wallet-provider');
       getWallets = await walletProvider.providers(true, 10000);

        console.log('getWallets:', getWallets);


      } else {
        throw new Error('getWallets can only be called on the client side');
      }
      console.log('getWallets:', getWallets);
     
      const wallet = getWallets.find((provider) => provider.name() === 'BEARBY');
      console.log('Wallet list:', wallet);

      if (!wallet) throw new Error('No MassaStation wallet found');

      const accounts = await wallet.accounts();
      console.log('Accounts:',accounts)
      if (accounts.length === 0) throw new Error('No accounts found in wallet');

      return { wallet: wallet,accounts: accounts[0].address };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for wallet-related state and actions
const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    connected: false,
    provider: null,
    accounts: [],
    error: null,
  },
  reducers: {
    disconnectWallet: (state) => {
      state.connected = false;
      state.provider = null;
      state.accounts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.connected = true;
        state.provider = action.payload.wallet;
        state.accounts = action.payload.accounts;
        state.error = null;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { disconnectWallet } = walletSlice.actions;

export default walletSlice.reducer;
