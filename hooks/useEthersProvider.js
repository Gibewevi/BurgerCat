import { useContext } from "react";
import EthersContext from "../pages/components/context/ethersProviderContext";

export default function useEthersProvider(){
    const context = useContext(EthersContext);
    if(!context){
        throw new error('useEthersProvider must be used within an EthersProvider');
    }
    return context;
}