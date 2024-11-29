import { useState ,useEffect} from "react";
import styles from "../styles/Assets.module.css";
import Header from "@/components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { supply, borrow, approve,Repay, availble } from '@/services/assets.service';
import {fetchAvailble} from '@/store/availbleSlice';
import { fetchBalance } from '@/store/balanceSlice';
import { fetchDebt } from '@/store/debtSlice';

const assetsSupply = [
    { symbol: 'WMASS', balance: '1,500', apy: '3.50%', logo: '/massa_logo.png', collateral: true, asset: "AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU",reserve:"AS1R4NLYojKdWu1FJXxkjXjQ7NsgDUYzZ15DfSe8AHmYhzvqC24L" },
    { symbol: 'USDT', balance: '2,000', apy: '1.75%', logo: '/tether-usdt-logo.png', collateral: true, asset: "" },
    { symbol: 'USDC', balance: '1,800', apy: '2.00%', logo: '/usd-coin-usdc-logo.png', collateral: true, asset: "" },
    { symbol: 'ETH', balance: '0.5000', apy: '4.00%', logo: '/ethereum-eth-logo.png', collateral: true, asset: "" },
];

const assetsBorrow = [
    { symbol: 'WMASS', apy: '2.50%', logo: '/massa_logo.png', available: 1_000, asset: "AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU",reserve:"AS1R4NLYojKdWu1FJXxkjXjQ7NsgDUYzZ15DfSe8AHmYhzvqC24L" },
    { symbol: 'USDT', apy: '1.25%', logo: '/tether-usdt-logo.png', available: 1_500, asset: "" },
    { symbol: 'USDC', apy: '2.75%', logo: '/usd-coin-usdc-logo.png', available: 1_200, asset: "" },
    { symbol: 'ETH', apy: '3.10%', logo: '/ethereum-eth-logo.png', available: 0.2500, asset: "" },
];

// Modal Component

const Modal = ({ isOpen, onClose, asset, action, loanDetails }) => {
  const [amount, setAmount] = useState('');
  const { accounts, provider } = useSelector((state) => state.wallet);

  if (!isOpen) return null;

  return (
      <div className={styles.modalOverlay}>
          <div className={styles.modal}>
              {/* Close Button */}
              <button onClick={onClose} className={styles.closeButton}>&times;</button>
              
              {/* Modal Content */}
              {loanDetails ? (
                  <>
                      <h2>Loan Details</h2>
                      <p><strong>Interest Rate:</strong> {loanDetails.interest}</p>
                      <p><strong>Debt:</strong> {loanDetails.debt}</p>
                      <label htmlFor="amount">Amount</label>

                      <input
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className={styles.input}
                      />
                                              <div className={styles.buttonGroup}>

                      <button type="button" className={styles.confirmButton} onClick={() => Repay(provider,asset,amount)}>Confirm</button>
                      </div>
                  </>
              ) : (
                  <>
                      <h2>{action === 'supply' ? "Supply Asset" : "Borrow Asset"}</h2>
                      <p><strong>Asset:</strong> {asset.symbol}</p>
                      <p><strong>APY:</strong> {asset.apy}</p>
                      <label htmlFor="amount">Amount</label>
                      <input
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className={styles.input}
                      />
                      <div className={styles.buttonGroup}>
                          {action === 'supply' ? (
                              <>
                                  <button type="button" className={styles.approveButton} onClick={() => approve(provider,asset,amount)}>Approve</button>
                                  <button type="button" className={styles.confirmButton} onClick={() => supply(provider,asset,amount)}>Confirm</button>
                              </>
                          ) : (
                              <button type="button" className={styles.confirmButton} onClick={() => borrow(provider,asset,amount)}>Confirm</button>
                          )}
                      </div>
                  </>
              )}
          </div>
      </div>
  );
};




const AssetsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [actionType, setActionType] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);
  const [rewards, setRewards] = useState({});
  const { accounts, provider, connected } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
   const balances = useSelector((state) => state.balance.assets);
   const disponible = useSelector((state) => state.availble.assets);
   const debt = useSelector((state) => state.debt.assets);
   console.log(debt)

  const openModal = (asset, action) => {
      setSelectedAsset(asset);
      setActionType(action);
      setModalOpen(true);
  };

  const openDetailsModal = (asset) => {
      // Mock data for loan details
      console.log(asset)
      if(asset.reserve){
      dispatch(fetchDebt({ provider, asset: asset.asset, symbol: asset.symbol ,reserve:asset.reserve}));
      }

      const loanDetailsData = {
          interest: "5.0%",
          debt: debt[asset.symbol] ?  parseFloat(Number(debt[asset.symbol]) / Number(10 ** asset.decimals)) : 0,
      };
      setSelectedAsset(asset);

      setLoanDetails(loanDetailsData);
      setDetailsModalOpen(true);
  };

  const closeModal = () => {
      setModalOpen(false);
      setSelectedAsset(null);
      setActionType('');
  };
  useEffect(() => {
      assetsSupply.forEach((asset) => {
        if (asset.asset) { // Only fetch if asset has a contract address
          dispatch(fetchBalance({ provider, asset: asset.asset, symbol: asset.symbol }));
        }
        if (asset.reserve) { // Only fetch if asset has a contract address
          dispatch(fetchAvailble({ provider, asset: asset.asset, symbol: asset.symbol ,reserve: asset.reserve}));
        }
        console.log(balances)

      });
    }, [dispatch, provider]);
  return (
      <>
          <Header />
          <div className={styles.container}>
              {/* Card for Assets to Supply */}
              <div className={styles.card}>
                  <h3>Assets to Supply</h3>
                  <table className={styles.table}>
                      <thead>
                          <tr>
                              <th>Asset</th>
                              <th>Wallet Balance</th>
                              <th>APY</th>
                              <th>Collateral</th>
                              <th>Rewards</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          {assetsSupply.map((asset, index) => (
                              <tr key={index}>
                                  <td>
                                      <div className={styles.assetRow}>
                                          <img src={asset.logo} alt={asset.symbol} className={styles.logo} />
                                          {asset.symbol}
                                      </div>
                                  </td>
                                  <td>{balances[asset.symbol] ? parseFloat(Number(balances[asset.symbol])/ Number(10 ** asset.decimals)) :0}</td>
                                  <td>{asset.apy}</td>
                                  <td>{asset.collateral ? '✔' : ''}</td>
                                  <td>{/*rewards[asset.symbol] || */'0'}</td>
                                  <td>
                                      <button className={styles.supplyButton} onClick={() => openModal(asset, 'supply')}>Supply</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Card for Assets to Borrow */}
              <div className={styles.card}>
                  <h3>Assets to Borrow</h3>
                  <table className={styles.table}>
                      <thead>
                          <tr>
                              <th>Asset</th>
                              <th>Available</th>
                              <th>APY</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          {assetsBorrow.map((asset, index) => (
                              <tr key={index}>
                                  <td>
                                      <div className={styles.assetRow}>
                                          <img src={asset.logo} alt={asset.symbol} className={styles.logo} />
                                          {asset.symbol}
                                      </div>
                                  </td>
                                  <td>{disponible[asset.symbol] ? parseFloat(Number(disponible[asset.symbol])/ Number(10 ** asset.decimals)) :0}</td>
                                  <td>{asset.apy}</td>
                                  <td>
                                      <button onClick={() => openModal(asset, 'borrow')} className={styles.borrowButton}>Borrow</button>
                                      <button onClick={() => openDetailsModal(asset)} className={styles.detailsButton}>Details</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Supply/Borrow Modal */}
          <Modal isOpen={modalOpen} onClose={closeModal} asset={selectedAsset} action={actionType} />

          {/* Loan Details Modal */}
          <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} loanDetails={loanDetails} asset={selectedAsset} />
      </>
  );
};


export default AssetsPage;
