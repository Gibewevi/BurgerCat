import MetamaskButton from './MetamaskButton';

export default function Header(){
    return(
        <header className="bg-gradient-to-r from-red-800 via-purple-500 to-red-500 w-full p-2 flex flex-col shadow-lg">
            <div className="max-w-7xl w-full mx-auto h-full flex justify-center items-center justify-between p-2">
                <div className='flex flex-row justify-center items-center'>
                    <h1 className="text-5xl font-black text-white">BURGERCAT</h1>
                    {/* <img src="./images/burger.svg" className="w-[60px] pt-1 mx-2 fill-white"></img> */}
                </div>
                <MetamaskButton />
            </div>
        </header>
    )
}