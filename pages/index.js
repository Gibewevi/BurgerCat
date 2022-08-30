import styles from '../styles/Home.module.css'
import Header from './components/header/Header'
import React, { useState, useEffect } from "react";
import SectionWeb3Band from './components/SectionWeb3Band'
import Before from './components/SectionMint/Before'
import PublicSale from './components/SectionMint/PublicSale'
import WhitelistSale from './components/SectionMint/WhitelistSale'
import SoldOut from './components/SectionMint/SoldOut'
import Reveal from './components/SectionMint/Reveal'
import Footer from './components/Footer';
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

  const maxWhitelist = 2;
  const maxNFT = 5;
  const toast = useToast();
  const contractAddress = "0xb8628703EbC82E5679b813aeeC5Be6464F8d9add";

  useEffect(()=>{
    if(account) {
      getDatas();
    }
  })

  const getDatas = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    const sellingStep = await contract.sellingStep();
     let whitelistSalePrice = await contract.whitelistSalePrice();
     let whitelistSalePriceBN = ethers.BigNumber.from(whitelistSalePrice._hex);
     whitelistSalePrice = ethers.utils.formatEther(whitelistSalePriceBN);

     let publicSalePrice = await contract.publicSalePrice();
     let publicSalePriceBN = ethers.BigNumber.from(publicSalePrice._hex);
     publicSalePrice = ethers.utils.formatEther(publicSalePriceBN);
    
     let totalSupply = await contract.totalSupply();

     totalSupply = totalSupply.toString();

     setSellingStep(sellingStep);
     setWhitelistSalePrice(whitelistSalePrice);
     setBNWhitelistSalePrice(whitelistSalePriceBN);

     setPublicSalePrice(publicSalePrice);
     setBNPublicSalePrice(publicSalePriceBN);

     setTotalSupply(totalSupply)
  }

  return (
    <div className={styles.container}>
      <div class="h-screen w-full">
        <Header />
        <SectionWeb3Band />
        {(() => {
          switch(sellingStep) {
            case null:
                return <Before/>
            case 0:
                return <Before/>
            case 1:
                return <WhitelistSale BNWhitelistSalePrice={whitelistSalePriceBN} WhitelistSalePrice={whitelistSalePrice} totalSupply={totalSupply} maxWhitelist={maxWhitelist} getDatas={getDatas} />
            case 2:
                return <PublicSale BNPublicSalePrice={BNPublicSalePrice} PublicSalePrice={PublicSalePrice} totalSupply={totalSupply} getDatas={getDatas} />

            case 3:
                return <SoldOut totalSupply={totalSupply} maxNFT={maxNFT}/>
            case 4:
                return <Reveal />
            default:
              return <Before />
          }
        })()}
        <SectionNFTs />
        <Footer />
      </div>
    </div>
  )
}
