
export default function Mint(){
    return(
            <div className="bg-web3-band mx-auto max-w-4xl shadow-lg p-5 border border-slate-200 shadow-lg shadow-purple-500/30 flex flex-row justify-between justify-center items-center">
                <img src="./images/burgerNFT.png" class="w-[230px] mx-5"></img>
                <div className="w-2/3 flex flex-col items-center">
                    <h3 className="flex flex-col text-center">
                        <span className="font-black text-5xl text-white tracking-wide">Mint is available !</span>
                        <span className="font-lighter text-xl tracking-wider">Let's go to mint your Burger Cat.</span>
                    </h3>
                    <button className="bg-purple-500 shadow-xl max-w-[150px] text-4xl px-3 p-1 mt-10 font-black text-white">Mint</button>
                </div>
            </div>
        )
}