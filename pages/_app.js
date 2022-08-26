import '../styles/globals.css'
import { EthersProvider } from './components/context/ethersProviderContext'
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
      return <Component {...pageProps} />
}

export default MyApp
