export default function ButtonLoading(){
    return(
        <a href="" className="bg-white rounded-lg px-3 shadow-lg border border-slate-100 flex flex-row justify-center justify-between items-center w-[150px] p-2">
            <div className="animate-spin rounded-full bg-white w-6 h-6 border-[5px] border-purple-600 border-r-purple-300"></div>
            <span className="font-bold text-purple-700 text-lg">Processing</span>
         </a> 
        )
}