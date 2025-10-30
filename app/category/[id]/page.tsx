"use client"
import Search from "@/component/search";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Filter } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ParamValue } from "next/dist/server/request/params";
export default function Category(){
    type value = {
    id: number
    title: string,
    thumbnail: string,
    price: number,
    category: string
  }
    const {id} = useParams()
    const [query, setQuery] = useState("")
    const [data, setData] = useState<value[] | undefined>(undefined)
    const router = useRouter()
    const getCategory = async(category: string | ParamValue) =>{
        await fetch(`../api/logic?action=category`,{method: "POST", body: JSON.stringify({id: category})})
        .then(res=>res.json()
        .then(products=>{
            if(products){
                setData(products)
                console.log(products)
            }else{
                console.error(data)
            }
        })
    )}
    useEffect(()=>{
        getCategory(id)
    },[])
    return(
        <div className="mt-25">
            <Search onData={setQuery}/>
            <header className="flex gap-x-4 mb-8 mx-25">
                <p className="font-montserrat gap-x-1 flex items-center">Categories <Filter width={14}/> </p>
                <div className="flex relative gap-x-5">
                    <button onClick={()=>router.push("./beauty")} className="font-roboto cursor-pointer">Beauty</button>
                    <button onClick={()=>router.push("./fragrances")} className="font-roboto cursor-pointer">Fragrances</button>
                    <button onClick={()=>router.push("./furniture")} className="font-roboto cursor-pointer">Furniture</button>
                    <button onClick={()=>router.push("./groceries")} className="font-roboto cursor-pointer">Groceries</button>
                    <button onClick={()=>router.push("./homedecoration")} className="font-roboto cursor-pointer">Home decoration</button>
                    <button onClick={()=>router.push("./laptops")} className="font-roboto cursor-pointer">Laptops</button>
                    <button onClick={()=>router.push("./mens")} className="font-roboto cursor-pointer">Mens Wear</button>
                    <button onClick={()=>router.push("./sunglasses")} className="font-roboto cursor-pointer">Sunglasses</button>
                    <button onClick={()=>router.push("./motorcycle")} className="font-roboto cursor-pointer">Motorcycle</button>
                    <button onClick={()=>router.push("./vehicle")} className="font-roboto cursor-pointer">Vehicle</button>
                    <button onClick={()=>router.push("./womens")} className="font-roboto cursor-pointer">Womens wear</button>
                    <button onClick={()=>router.push("../category")} className="font-roboto cursor-pointer bg-gray-300 gap-x-1 px-0.5 rounded-sm flex justify-between items-center absolute top-0 right-0">More <MoveRight className="w-2"/></button>
                </div>
            </header>
            <main className="bg-orange-200 rounded-sm px-10 py-3 mb-1 mx-25">
                <h2 className="mb-2 font-montserrat font-bold text-black text-lg">{id?.toString().toLocaleUpperCase()}</h2>
                <main className="grid grid-cols-5 justify-between">
                {data && data.map((e,index)=>(
                    <Link href={`../${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                        <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                        <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                        <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                    </Link>
                    ))
                }
            </main>
          </main>
        </div>
    )
}