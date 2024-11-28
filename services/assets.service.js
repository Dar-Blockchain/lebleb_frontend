const lending_pool_address=process.env.NEXT_PUBLIC_Lending_Pool_Address;
const reserveAddress =process.env.NEXT_PUBLIC_Reserve


const approve = async (provider,asset,amount) => {
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
const supply = async (provider,asset,amount) => {
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
async function Repay(provider,asset,amount) {
    try {
        console.log(asset)
        let _amount = BigInt(amount * 10 ** 9) ;
        const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
        let account_ = await provider.accounts()
        const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);

      let addingReserve=new Args().addString(asset.asset).addU256(_amount)
      console.log(addingReserve)
      const a = await massaClient.smartContracts().callSmartContract({
        targetAddress: lending_pool_address,
        targetFunction: "repay",
        parameter: addingReserve.serialize(),
        maxGas: BigInt(2000_000_000n),
        coins: BigInt(2 * 10**9),
        fee: BigInt(2000_000_000n),
      });
      console.log(a)
  return a;
    } catch (error) {
      console.error("Error In setting the marketplace fee:", error);
    }
  }
const borrow = async (provider,asset,amount) => {
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
  targetFunction: "borrow",
  parameter: deposit_.serialize(),
  maxGas: BigInt(2000_000_000n),
  coins: BigInt(2 * 10**9),
  fee: BigInt(2000_000_000n),
});
    console.log(a)
}
const balanceOf = async (provider,asset) => {
    console.log(provider)
    const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
    let account_ = await provider.accounts()
    console.log(asset)

    const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
    try{ 
        const balance = await massaClient.smartContracts().readSmartContract({
        maxGas: BigInt(4100000),
        targetAddress: asset,
        targetFunction: "balanceOf",
        parameter: new Args().addString(account_[0]._address).serialize(),
      });
      return new Args(balance.returnValue).nextU256()}
      catch(e){
        console.log(e)
          return 0
      }
   
}
const availble = async (provider,asset,reserve) => {
    console.log(provider)
    const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
    let account_ = await provider.accounts()
    console.log(asset)

    const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
    try{ 
        const balance = await massaClient.smartContracts().readSmartContract({
        maxGas: BigInt(4100000),
        targetAddress: asset,
        targetFunction: "balanceOf",
        parameter: new Args().addString(reserve).serialize(),
      });
      return new Args(balance.returnValue).nextU256()}
      catch(e){
        console.log(e)
          return 0
      }
   
}
const userDebt = async (provider,asset,reserve) => {
    console.log(provider)
    const { Args,ClientFactory  } = await import('@massalabs/massa-web3');
    let account_ = await provider.accounts()
    console.log(asset)

    const massaClient = await ClientFactory.fromWalletProvider(provider, account_[0]);
    try{ 
        const balance = await massaClient.smartContracts().readSmartContract({
        maxGas: BigInt(4100000),
        targetAddress: reserve,
        targetFunction: "getUserDebtAmount",
        parameter: new Args().addString(account_[0]._address).serialize(),
      });
      return new Args(balance.returnValue).nextU256()}
      catch(e){
        console.log(e)
          return 0
      }
   
}
export  {approve,borrow,supply,Repay,balanceOf,availble,userDebt};