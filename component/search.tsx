import { useEffect, useState } from "react"

export default function Search({onData}:{onData: (data: string)=>void}){
    const [value, setValue] = useState("")
    useEffect(()=>{
        onData(value)
    },[value])
    return(
        <div className="w-full flex my-5 px-25 gap-x-2.5">
            <input type="search" onInput={(e: React.ChangeEvent<HTMLInputElement>)=>{
                const me = e.target.value
                setValue(me)
            }} name="search" id="" className="outline-0 px-2.5 border w-full h-10 rounded-lg border-gray-500"/>
            <button type="submit" className="bg-blue-500  hover:bg-blue-300 duration-300 font-roboto px-4 rounded-lg cursor-pointer font-bold text-light">Search</button>
        </div>
    )
}