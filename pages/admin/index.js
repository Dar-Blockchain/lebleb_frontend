// pages/admin/new-reserve.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, callSmartContract } from '../../store/walletSlice';
import Header from "@/components/Header";
import styles from '../../styles/NewReserveForm.module.css';
import { account } from '@massalabs/massa-web3';

const NewReserveForm = () => {
  const dispatch = useDispatch();
  const {  accounts ,provider} = useSelector((state) => state.wallet);
  const [assetAddress, setAssetAddress] = useState('');
  const [reserveAddress, setReserveAddress] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

   
      // Prepare arguments for the smart contract call
      const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
      let account_ = await provider.accounts()
      console.log(account_[0]._address)
      const args = new Args().addString(assetAddress).addString(reserveAddress);

      const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
      const lending_pool_address =  process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS;
      const operationId = await massaClient.smartContracts().callSmartContract({
        targetAddress: lending_pool_address,
        targetFunction: 'addReserve',
        parameter: args.serialize(),
        maxGas: BigInt(10_000_000n),
      coins: BigInt(0),
      fee: BigInt(10_000_000n),
      })
      console.log('Operation ID:', operationId);
   
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.heading}>Create New Reserve</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Asset Address
          <input
            type="text"
            value={assetAddress}
            onChange={(e) => setAssetAddress(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Reserve Address
          <input
            type="text"
            value={reserveAddress}
            onChange={(e) => setReserveAddress(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <button type="submit" className={styles.button}>Create Reserve</button>
      </form>
    </div>
  );
};

export default NewReserveForm;
