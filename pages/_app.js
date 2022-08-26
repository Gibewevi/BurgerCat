import '../styles/globals.css'
import { EthersProvider } from './components/context/ethersProviderContext'
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
      return (
        <EthersProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </EthersProvider>
      )
    }
    
    export default MyApp
    