"use client"
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation"
import Search from "@/component/search";
import { Filter, MoveRight} from "lucide-react";
export default function Page(){
    type value = {
    id: number
    title: string,
    thumbnail: string,
    price: number,
    category: string
  }
    const [query, setQuery] = useState("")
    const [data, setData] = useState<value[] | undefined>(undefined)
    const [category, setCategory] = useState<string[]>([])
    const router = useRouter()
    useEffect(()=>{
        const arr = [...new Set(data?.map(item => item.category))]
        setCategory(arr)
    },[data])
      const getProducts = async () => {
        await fetch('./api/logic?action=getProduct',{method: "GET"})
        .then(res=>res.json())
        .then(data=>{
          setData(data)})
      }
      useEffect(()=>{
        getProducts()
      },[])
    return(
        <div className="mt-25">
            <Search onData={setQuery}/>
            <header className="flex gap-x-4 mb-8 mx-25">
                <p className="font-montserrat gap-x-1 flex items-center">Categories <Filter width={14}/> </p>
                <div className="flex relative w-full justify-between">
                    <button onClick={()=>router.push("./category/beauty")} className="font-roboto cursor-pointer">Beauty</button>
                    <button onClick={()=>router.push("./category/fragrances")} className="font-roboto cursor-pointer">Fragrances</button>
                    <button onClick={()=>router.push("./category/furniture")} className="font-roboto cursor-pointer">Furniture</button>
                    <button onClick={()=>router.push("./category/groceries")} className="font-roboto cursor-pointer">Groceries</button>
                    <button onClick={()=>router.push("./category/homedecoration")} className="font-roboto cursor-pointer">Home decoration</button>
                    <button onClick={()=>router.push("./category/laptops")} className="font-roboto cursor-pointer">Laptops</button>
                    <button onClick={()=>router.push("./category/mens")} className="font-roboto cursor-pointer">Mens Wear</button>
                    <button onClick={()=>router.push("./category/sunglasses")} className="font-roboto cursor-pointer">Sunglasses</button>
                    <button onClick={()=>router.push("./category/motorcycle")} className="font-roboto cursor-pointer">Motorcycle</button>
                    <button onClick={()=>router.push("./category/vehicle")} className="font-roboto cursor-pointer">Vehicle</button>
                    <button onClick={()=>router.push("./category/womens")} className="font-roboto cursor-pointer">Womens wear</button>
                    <button onClick={()=>router.push("../category")} className="font-roboto cursor-pointer bg-gray-300 gap-x-1 px-0.5 rounded-sm flex justify-between items-center absolute top-0 right-0">More <MoveRight className="w-2"/></button>
                </div>
            </header>
            <main className="mx-25">
                {category && category.map((cat, index)=>(
                    <aside key={index} className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
                        <h2 className="mb-2 font-montserrat font-bold text-black text-lg">{cat.toLocaleUpperCase()}</h2>
                        <main className="grid grid-cols-5 justify-between">
                            {
                                data && data.map((e,index)=>(e.category == cat && (
                                    <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                                        <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                                        <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                                        <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                                    </Link>
                                ) ))
                            }
                        </main>
                    </aside>
                ))}
            </main>
        </div>
    )
}