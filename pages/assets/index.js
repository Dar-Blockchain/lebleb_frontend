import { useState ,useEffect} from "react";
import styles from "../../styles/Assets.module.css";
import Header from "@/components/Header";
import { useDispatch, useSelector } from 'react-redux';

const assetsSupply = [
    { symbol: 'WMASS', balance: '1,500', apy: '3.50%', logo: '/massa-logo.png', collateral: true, asset: "AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU" },
    { symbol: 'USDC', balance: '2,000', apy: '1.75%', logo: '/usdc-logo.png', collateral: true, asset: "" },
    { symbol: 'USDT', balance: '1,800', apy: '2.00%', logo: '/usdt-logo.png', collateral: true, asset: "" },
    { symbol: 'ETH', balance: '0.5000', apy: '4.00%', logo: '/eth-logo.png', collateral: true, asset: "" },
];

const assetsBorrow = [
    { symbol: 'WMASS', apy: '2.50%', logo: '/massa-logo.png', available: 1_000, asset: "AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU" },
    { symbol: 'USDC', apy: '1.25%', logo: '/usdc-logo.png', available: 1_500, asset: "" },
    { symbol: 'USDT', apy: '2.75%', logo: '/usdt-logo.png', available: 1_200, asset: "" },
    { symbol: 'ETH', apy: '3.10%', logo: '/eth-logo.png', available: 0.2500, asset: "" },
];

// Modal Component
const lending_pool_address=process.env.NEXT_PUBLIC_Lending_Pool_Address;
const reserveAddress =process.env.NEXT_PUBLIC_Reserve
const Modal = ({ isOpen, onClose, asset, action }) => {
    const [amount, setAmount] = useState('');
    const {  accounts ,provider} = useSelector((state) => state.wallet);

    if (!isOpen) return null;
    const approve = async () => {
        console.log(asset.asset)
        const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
        let account_ = await provider.accounts()
        console.log(account_[0]._address)
  
        const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
        let _amount = BigInt(amount * 10 ** 9);
        console.log(_amount,lending_pool_address)
    let feeArg = new Args().addString(lending_pool_address).addU256(_amount);
    const a = await massaClient.smartContracts().callSmartContract({
      targetAddress: asset.asset,
      targetFunction: "increaseAllowance",
      parameter: feeArg.serialize(),
      maxGas: BigInt(2100000),
      coins: BigInt(0),
      fee: BigInt(10_000_000n),
    });
        console.log(feeArg)
    }
    const supply = async () => {
        console.log(asset.asset)
        const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
        let account_ = await provider.accounts()
        console.log(account_[0]._address)
  
        const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
        let _amount = BigInt(amount * 10 ** 9) ;
        console.log(_amount,lending_pool_address)
        let deposit_=new Args().addString(asset.asset).addU256(_amount);
        const a = await massaClient.smartContracts().callSmartContract({
      targetAddress: lending_pool_address,
      targetFunction: "deposit",
      parameter: deposit_.serialize(),
      maxGas: BigInt(2000_000_000n),
      coins: BigInt(2 * 10**9),
      fee: BigInt(2000_000_000n),
    });
        console.log(a)
    }
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
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
              <button type="button" className={styles.approveButton} onClick={() =>approve()}>Approve</button>
              <button type="button" className={styles.confirmButton} onClick={() =>supply()}  >Confirm</button>
            </div>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
      </div>
    );
  };
 
  
const AssetsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [actionType, setActionType] = useState('');
  const [rewards, setRewards] = useState({});
  const {  accounts ,provider,connected} = useSelector((state) => state.wallet);
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch

  const ReserveUserRewards = async (user) => {
    const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
    let account_ = await provider?.accounts()
    if(connected)
        {const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
            try {
              const balance = await massaClient.smartContracts().readSmartContract({
                maxGas: BigInt(800_000_000n),
                coins: BigInt(2 * 10 ** 9),
                fee: BigInt(800_000_000n),
                targetAddress: reserveAddress,
                targetFunction: "calculateUserRewards",
                parameter: new Args().addString(account_[0]),
              });
              const rewards = new Args(balance.returnValue).nextU256();
              console.log("User rewards:", rewards);
              return rewards;
            } catch (error) {
              console.error("Error in getting all users collections:", error);
              return 0;
            }}    
    
  };
  const openModal = (asset,action) => {
    setSelectedAsset(asset);
    setActionType(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAsset(null);
    setActionType('');
  };
  useEffect(() => {
    // Fetch rewards for each asset in the supply list
    const fetchRewards = async () => {
      const newRewards = {};
      for (const asset of assetsSupply) {
        const reward = await ReserveUserRewards(asset.asset);
        newRewards[asset.symbol] = reward;
      }
      console.log(newRewards);

      setRewards(newRewards);
    };
    fetchRewards();
  }, [refresh]);
  console.log(connected);

  return (
    <>
      <Header />
      <div className={styles.container}>
      <button onClick={() => setRefresh(!refresh)} className={styles.refreshButton}>
          Refresh Rewards
        </button>
        <div className={styles.section}>
          <div className={styles.header}>
            <h3>Assets to supply</h3>
            <div className={styles.hideButton}>Hide —</div>
          </div>
          <div className={styles.checkbox}>
            <label>
              <input type="checkbox" /> Show assets with 0 balance
            </label>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Wallet Balance</th>
                <th>APY</th>
                <th>Collateral</th>
                <th>Rewards</th> {/* New Rewards Column */}
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
                  <td>{asset.balance}</td>
                  <td>{asset.apy}</td>
                  <td>{asset.collateral ? '✔' : ''}</td>
                  <td>{rewards[asset.symbol] || '0'}</td> {/* Display Rewards */}
                  <td>
                    <button className={styles.supplyButton} onClick={()=>openModal(asset,"supply")}>Supply</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <div className={styles.header}>
            <h3>Assets to borrow</h3>
            <div className={styles.hideButton}>Hide —</div>
          </div>
          <div className={styles.infoText}>
            To borrow you need to supply any asset to be used as collateral.
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Available</th>
                <th>APY, variable</th>
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
                  <td>{asset.available}</td>
                  <td>{asset.apy}</td>
                  <td className={styles.actionButtons}>
                    <button onClick={() => openModal(asset, 'borrow')} className={styles.borrowButton}>Borrow</button>
                    <button className={styles.detailsButton}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} asset={selectedAsset} action={actionType} />
    </>
  );
};

export default AssetsPage;
