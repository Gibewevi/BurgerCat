import styles from '../styles/Home.module.css'
import Header from './components/header/Header'
import React, { useState, useEffect } from "react";
import SectionWeb3Band from './components/SectionWeb3Band'
import Before from './components/SectionMint/Before'
import PublicSale from './components/SectionMint/PublicSale'
import WhitelistSale from './components/SectionMint/WhitelistSale'
import SoldOut from './components/SectionMint/SoldOut'
import Reveal from './components/SectionMint/Reveal'
import SectionNFTs from './components/SectionNFTs'
import { EthersProvider } from './components/context/ethersProviderContext'
import useEthersProvider from '../hooks/useEthersProvider';
import { ChakraProvider, useToast } from "@chakra-ui/react";
import Contract from "../artifacts/contracts/BurgerCatERC721A.sol/BurgerCatERC721A.json";
import { ethers } from "ethers";

export default function Home() {

  const { account, provider } = useEthersProvider();
  const [isLoading, setIsLoading] = useState(false);

  //0 : Before, 1 : WhitelistSale, 2 : PublicSale, 3 : SoldOut, 4 : Reveal
  const [sellingStep, setSellingStep] = useState(null);
  //SaleStartTime
  const [SaleStartTime, setSaleStartTime] = useState(null);
  //WhitelistSale price
  const [BNWhitelistSalePrice, setBNWhitelistSalePrice] = useState(null);
  const[WhitelistSalePrice, setWhitelistSalePrice] = useState(null);
  //PublicSale price
  const [BNPublicSalePrice, setBNPublicSalePrice] = useState(null);
  const [PublicSalePrice, setPublicSalePrice] = useState(null);
  //Total Supply
  const [totalSupply, setTotalSupply] = useState(null);

  const toast = useToast();
  const contractAddress = "0x7AEDC07bB300b9f839eA5197268e9891661bb471";

  useEffect(()=>{
    if(account) {
      getDatas();
    }
  })

  const getDatas = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    const sellingStep = await contract.sellingStep();
     let WhitelistSalePrice = await contract.whitelistSalePrice();
     let WhitelistSalePriceBN = ethers.BigNumber.from(WhitelistSalePrice._hex);
     WhitelistSalePrice = ethers.utils.formatEther(WhitelistSalePriceBN);

     let publicSalePrice = await contract.publicSalePrice();
     let publicSalePriceBN = ethers.BigNumber.from(publicSalePrice._hex);
     publicSalePrice = ethers.utils.formatEther(publicSalePriceBN);
    
     let totalSupply = await contract.totalSupply();
     totalSupply = totalSupply.toString();

     setSellingStep(sellingStep);
     setWhitelistSalePrice(WhitelistSalePrice);
     setBNWhitelistSalePrice(WhitelistSalePriceBN);
     setPublicSalePrice(publicSalePrice);
     setBNPublicSalePrice(publicSalePriceBN);
     setTotalSupply(totalSupply)
  }


  return (
    <div className={styles.container}>
        <Header />
        <SectionWeb3Band />
        {(() => {
          switch(sellingStep) {
            case null:
                return <Before/>
            case 0:
                return <Before/>
            case 1:
                return <WhitelistSale 
                BNWhitelistSalePrice={BNWhitelistSalePrice} 
                WhitelistSalePrice={WhitelistSalePrice} 
                totalSupply={totalSupply} 
                getDatas={getDatas} />
            case 2:
                return <PublicSale 
                BNPublicSalePrice={BNPublicSalePrice}
                publicSalePrice={publicSalePrice}
                totalSupply={totalSupply}
                getDatas={getDatas}
                />
            case 3:
                return <SoldOut totalSupply={totalSupply}/>
            case 4:
                return <Reveal />
            default:
              return <Before />
          }
        })()}
        <SectionNFTs />
    </div>
  )
}
