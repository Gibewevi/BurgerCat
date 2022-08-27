import { useToast } from "@chakra-ui/react"
import useEthersProvider from "../../../hooks/useEthersProvider"

export default function ButtonMint(){
    return(
        <div className="">
            <form className="flex flex-row justify-center justify-between mt-8 w-full p-2 w-[240px]">
                <input type="number" className="p-3 w-[90px] rounded-md text-center font-bold" placeholder="1"></input>
                <button className="bg-purple-500 shadow-xl max-w-[150px] text-4xl px-3 p-1 font-black text-white">Mint</button>
           </form>
        </div>
        )
}