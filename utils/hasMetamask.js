const hasMetamask = () => {
    return(
        typeof window !== "undefined" && typeof 
        window.ethreum !== "undefined"
        )
    }
    
    export { hasMetamask }