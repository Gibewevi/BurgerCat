export default function Footer(){
    return(
            <footer className="bg-footer-band p-1 w-full absolute bottom-0">
                    <div className="flex flex-row justify-center items-center max-w-7xl mx-auto justify-between">
                        <div className="flex flex-col justify-center">
                             <h3 className="font-bold text-white text-lg">Copyright BurgerCat</h3>
                             <span className="font-lighter text-white text-white text-sm tracking-wide">Copyright BurgerCat All rights reserved</span>
                        </div>
                        <div className="flex flex-row">
                            <img src="./images/twitter.svg" className="w-12 h-12"></img>
                            <img src="./images/instagram.svg" className="w-9 h-9 mt-1.5 mx-3"></img>
                            <img src="./images/facebook.svg" className="w-10 h-10 mt-1"></img>
                        </div>
                    </div>
            </footer>
        )
}