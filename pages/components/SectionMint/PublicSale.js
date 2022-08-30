import ButtonMint from "./ButtonMint";
import { useEffect, useState } from "react";
import useEthersProvider from "../../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../../artifacts/contracts/BurgerCatERC721A.sol/BurgerCatERC721A.json";
import { Button, useToast } from "@chakra-ui/react";
import ButtonLoading from "./ButtonLoading";
import SoldOut from "./SoldOut";

export default function PublicSale(props){
    const MAX_SUPPLY = 5;
    const { account, provider } = useEthersProvider();
    const [mintIsLoading, setMintIsLoading] = useState(false);
    const [countIsLoading, setCountIsLoading] = useState(false);
    const [PublicSale, setPublicSale] = useState(0);
    const [seconds, setSeconds] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState(null);
    const [days, setDays] = useState(null);
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
    const saleStartTime = 1661781600;
    // const endSaleTime = saleStartTime + 12 * 3600;
    const endSaleTime = saleStartTime + 25*3600;

    const toast = useToast();
    const contractAddress = "0xb8628703EbC82E5679b813aeeC5Be6464F8d9add";

    useEffect(() => {
        getCount()
    }, [])
 
    const mint = async(quantity) => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Contract.abi, signer);

        let overrides = {
            value: props.BNPublicSalePrice.mul(quantity)
        }

        try {
            let transaction = await contract.publicMint(account, quantity, overrides);
            setMintIsLoading(true)
            await transaction.wait();
            setMintIsLoading(false);
            toast({
                description: "Congratulations! You have minted your NFT!",
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
        setCountIsLoading(true);
        var calc = setInterval(function() {
            let unixTime = saleStartTime * 1000;
            let date_future = new Date(unixTime);
            let date_now = new Date();
            let seconds = Math.floor((date_future - (date_now)) / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
            hours = hours-(days * 24);
            minutes = minutes-(days * 24 * 60)-(hours * 60);
            seconds = seconds-(days * 24 * 60 * 60)-(hours * 60 * 60)-(minutes * 60);
            let Timestamp = Math.floor(Date.now() / 1000);
            setDays(days)
            setHours(hours)
            setMinutes(minutes)
            setSeconds(seconds)
            setCountIsLoading(false)

            if(date_now<date_future){
                // NOT AVAILABLE
                setPublicSale(0);
            }
            else if(date_now>date_future && Timestamp<=endSaleTime && props.totalSupply < MAX_SUPPLY){
                // WHITELIST SALE OPEN
                setPublicSale(1);
            }
            else if(date_now>date_future && Timestamp<=endSaleTime && props.totalSupply == MAX_SUPPLY){
                // SOLD OUT 
                setPublicSale(2)
            }
            else if (date_now>date_future && Timestamp>=endSaleTime){
                // WHITELIST CLOSE
                setPublicSale(3)
            }

        }, 1000);
    }


    return(
         <section className="max-w-7xl mx-auto">
            <div className="bg-web3-band mx-auto max-w-7xl shadow-lg p-5 border border-slate-200 shadow-lg shadow-purple-500/30 flex flex-row justify-between justify-center items-center">
                <div className="flex flex-row justify-center items-center justify-between">
                    <img src="./images/burgerNFT.png" className="w-[230px] mx-5"></img>

                {(() => {
                switch(PublicSale) {
                    case 0:
                        return (
                            <div>{countIsLoading ? (
                                <span></span>
                            ) : (
                                <div className="flex flex-col font-black text-6xl text-center text-white mx-10 text-center">
                                    <span>{hours+'H'}</span>
                                    <span>{minutes+'M'}</span>
                                    <span>{seconds+'S'}</span> 
                                </div>
                            )}</div>)
                }
                })()}

                </div>

                {(() => {
                switch(PublicSale) {
                    case 0:
                        return (
                            <div className="w-2/3 flex flex-col items-center">{countIsLoading ? (
                                <ButtonLoading />
                            ) : (
                                <h3 className="flex flex-col text-center">                        
                                    <span className="font-black text-5xl text-white tracking-wide">Public sale soon available</span>
                                </h3>
                            )}</div>)

                    case 1:
                        return (
                            <div className="w-2/3 flex flex-col items-center">{mintIsLoading ? (
                                <h3 className="flex flex-col text-center justify-center items-center">                        
                                    <span className="font-black text-5xl text-white tracking-wide">Public sale is available !</span>
                                    <span className="font-lighter text-xl tracking-wider">Let's go to mint your Burger Cat.</span>
                                    <ButtonLoading className="mt-4"/>
                                </h3>
                            ) : (
                                <h3 className="flex flex-col text-center justify-center items-center">                        
                                    <span className="font-black text-5xl text-white tracking-wide">Public sale is available !</span>
                                    <span className="font-lighter text-xl tracking-wider">Let's go to mint your Burger Cat.</span>
                                    <button onClick={() => mint(1)} className="bg-purple-500 shadow-xl max-w-[150px] text-4xl mt-5 px-3 p-1 font-black text-white">{mintIsLoading ?(<ButtonLoading/>):('Mint')}</button>
                                </h3>
                            )}</div>)

                            
                    case 2:
                        return (
                            <div className="w-2/3 flex flex-col items-center">{countIsLoading ? (
                                <ButtonLoading />
                            ) : (
                                <h3 className="flex flex-col text-center items-center">              
                                        <span className="font-black text-5xl text-white tracking-wide">SOLD OUT</span>
                                        <span className="font-lighter text-xl tracking-wider">Sorry, you came too late... :(</span>
                                    </h3>
                            )}</div>)
                    case 3:
                        return (
                            <div className="w-2/3 flex flex-col items-center">{countIsLoading ? (
                                <ButtonLoading />
                            ) : (
                                <h3 className="flex flex-col text-center">                        
                                    <span className="font-black text-5xl text-white tracking-wide">Public sale is close !</span>
                                    <span className="font-lighter text-xl tracking-wider">Sorry, you came too late... :(</span>
                                </h3>
                            )}</div>)
                }
                })()}
            </div>

        </section>
        )
}