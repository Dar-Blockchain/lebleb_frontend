// src/components/Header.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, disconnectWallet } from '../store/walletSlice';
import styles from '../styles/Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const { connected, provider } = useSelector((state) => state.wallet);
  const a= useSelector((state) => console.log(state.wallet));

  console.log(provider,"aaaaaa");

  const handleConnect = () => {
    dispatch(connectWallet());
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };
  console.log(provider);
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Admin Panel</h2>
      <div>
        {connected ? (
          <div className={styles.connectedContainer}>
            <span className={styles.connectedText}>
              Connected: {provider?.accounts()[0]?.slice(0, 6)}...{provider?.accounts()[0]?.slice(-4)}
            </span>
            <button onClick={handleDisconnect} className={styles.disconnectButton}>
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={handleConnect} className={styles.connectButton}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
