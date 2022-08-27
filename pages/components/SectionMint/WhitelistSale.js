import ButtonMint from "./ButtonMint";
import useEthersProvider from "../../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../../artifacts/contracts/BurgerCatERC721A.sol/BurgerCatERC721A.json";
import tokens from '../../../tokens.json';
import { MerkleTree } from 'merkletreejs';
import keccak256 from "keccak256";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TransactionDescription } from "ethers/lib/utils";

export default function WhitelistSale(props){

    const { account, provider } = useEthersProvider;
    const [mintIsLoading, setMintIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState(null);
    const [days, setDays] = useState(null);
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));

    const saleStartTime = 1661628600;
    const endSaleTime = saleStartTime + 12 * 3600;

    const toast = useToast;
    const contractAddress = "0x9dB2c6cC3257a7C500Dfdf0d2b23C0f8EDe9C7f9";
    const [whitelistOpen, setWhitelistOpen] = useState(false);

    useEffect(() => {
        getCount()
    }, [])
    
    const mint = async() => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Contract.abi, signer);

        let tab = [];
        tokens.map((token) => {
          tab.push(token.address);
        });
        const leaves = tab.map((address) => keccak256(address));
        const tree = new MerkleTree(leaves, keccak256, { sort: true });
        let leaf = keccak256(account);
        let proof = tree.getHexProof(leaf);

        let overrides = {
            value: props.BNWhitelistSalePrice
        }

        try {
            let transaction = await contract.whitelistMint(account, 1, proof, overrides);
            await transaction.wait();
            toast({
                description: "Congratulations ! You have minted you BurgerCat !",
                status: "success",
                duration: 4000,
                isClosable: true
            });
            props.getDatas();
        }
        catch {
            toast({
                description: "Oops... an error occured",
                status: "error",
                duration: 4000,
                isClosable: true
            });
        }
    }

    const getCount = () => {
        var calc = setInterval(function() {
            let unixTime = saleStartTime * 1000;
            let date_future = new Date(unixTime);
            let date_now = new Date();

            console.log("future " + date_future);
            console.log("now " + date_now);

            let seconds = Math.floor((date_future - (date_now)) / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
            
            hours = hours-(days * 24);
            minutes = minutes-(days * 24 * 60)-(hours * 60);
            seconds = seconds-(days * 24 * 60 * 60)-(hours * 60 * 60)-(minutes * 60);
    
            setDays(days)
            setHours(hours)
            setMinutes(minutes)
            setSeconds(seconds)

            if(date_now>date_future){
                setWhitelistOpen(true);
            }

        }, 1000);
    }


    return(
        <section className="max-w-7xl mx-auto">
            <div className="bg-web3-band mx-auto max-w-7xl shadow-lg p-5 border border-slate-200 shadow-lg shadow-purple-500/30 flex flex-row justify-between justify-center items-center">
                <div className="flex flex-row justify-center items-center justify-between">
                    <img src="./images/burgerNFT.png" className="w-[230px] mx-5"></img>
                    <div className="flex flex-col font-black text-6xl text-center text-white mx-10 text-center">
                        <span>{whitelistOpen ? ''  : hours+'H'}</span>
                        <span>{whitelistOpen ? ''  : minutes+'M'}</span>
                        <span>{whitelistOpen ? ''  : seconds+'S'}</span>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col items-center">
                    <h3 className="flex flex-col text-center">
                        <span className="font-black text-5xl text-white tracking-wide">{whitelistOpen ? 'Whitelist sale available' : 'Whitelist sale is not available.'}</span>
                        <span className="font-lighter text-xl tracking-wider">Let's go to mint your Burger Cat.</span>
                    </h3>
                    {whitelistOpen ? <ButtonMint />  : ''}
                </div>
            </div>
        </section>
        )
}