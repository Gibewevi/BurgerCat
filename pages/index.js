import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from './components/header/Header'
import SectionWeb3Band from './components/SectionWeb3Band'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <SectionWeb3Band />
    </div>
  )
}
