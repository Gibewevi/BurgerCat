import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/header/Header'
import SectionWeb3Band from './components/SectionWeb3Band'
import SectionMint from './components/SectionMint.js/SectionMint'
import SectionNFTs from './components/SectionNFTs'
import { EthersProvider } from './components/context/ethersProviderContext'
import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <EthersProvider>
        <ChakraProvider>
          <Header />
            <SectionWeb3Band />
            <SectionMint />
            <SectionNFTs />
        </ChakraProvider>
      </EthersProvider>
    </div>
  )
}
