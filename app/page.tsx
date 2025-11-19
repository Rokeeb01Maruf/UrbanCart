"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Filter } from "lucide-react"
import React, { useEffect, useState } from "react"
import Head from "@/component/main"
import Search from "@/component/search"
export default function Page(){
  type value = {
    id: number
    title: string,
    thumbnail: string,
    price: number
  }
  const [query, setQuery] = useState("")
  const [anothers, setAnother] = useState<value[]>([])
  const [data, setData] = useState([])
  const [fsearch, setFsearch] = useState<value[]>([])
  const [other, setOther] = useState<value[]>([])
  const [topSales, setSales] = useState<value[]>([])
  const [collections, setCollections] = useState<value[]>([])
  const router = useRouter()
  const [img, setImg] = useState(["/images/holder1.jpg","/images/holder2.jpg","/images/holder3.jpg"])
  const handleClick =()=>{
    router.push("/category")
  }
  const getProducts = async () => {
    await fetch('./api/logic?action=getProduct',{method: "GET"})
    .then(res=>res.json())
    .then(datum=>{
      if(datum.error){
        console.log(datum.error)
      }else{
        setData(datum)
      }
    })
  }
  useEffect(()=>{
    getProducts()
  },[])
  useEffect(()=>{
    let beauty: value[]; let fragrances: value[]; let furniture: value[]; let groceries: value[]; let laptops: value[];
    let motorcycle: value[]; let women: value[]; let smartphones: value[]; let skincare: value[]; let tops: value[]; 
    if(data){
      beauty = data.filter((e:{category: string})=>e.category?.includes("beauty"))
      fragrances = data.filter((e:{category: string})=>e.category?.includes("fragrances"))
      furniture = data.filter((e:{category: string})=>e.category?.includes("furniture"))
      groceries = data.filter((e:{category: string})=>e.category?.includes("groceries"))
      laptops = data.filter((e:{category: string})=>e.category?.includes("laptops"))      
      motorcycle = data.filter((e:{category: string})=>e.category?.includes("motorcycle"))      
      women = data.filter((e:{category: string})=>e.category?.includes("womens-bags"))      
      smartphones = data.filter((e:{category: string})=>e.category?.includes("smartphones"))      
      skincare = data.filter((e:{category: string})=>e.category?.includes("vehicle"))      
      tops = data.filter((e:{category: string})=>e.category?.includes("tops"))      
      const frequent = [beauty[0], fragrances[0], furniture[0], groceries[0], laptops[0]]
      const top = [beauty[1], fragrances[1], furniture[1], groceries[1], laptops[1]]
      const collections = [beauty[2], fragrances[2], furniture[2], groceries[2], laptops[2]]
      const others: value[] = []
      for(let i = 0; i<4; i++){
        others.push(motorcycle[i],women[i], smartphones[i], skincare[i], tops[i])
      }
      let another: value[] = []
      for (let i = 150; i<180; i++){
        another.push(data[i])
      }
      setAnother(another)
      setCollections(collections)
      setFsearch(frequent)
      setSales(top)
      setOther(others)
    }
  },[data])
  return(
    <div>
      <Head img = {img} handleClick={()=>handleClick()}/>
      <Search onData={setQuery}/>
      <main className="px-25">
        <header className="flex gap-x-4 mb-8">
          <Link href={'/category'} className="font-montserrat cursor-pointer gap-x-1 flex items-center">Categories <Filter width={14}/> </Link>
          <div className="flex justify-between w-full">
            <Link href="/category/beauty" className="font-roboto cursor-pointer">Beauty</Link>
            <Link href="/category/fragrances" className="font-roboto cursor-pointer">Fragrances</Link>
            <Link href="/category/furniture" className="font-roboto cursor-pointer">Furniture</Link>
            <Link href="/category/groceries" className="font-roboto cursor-pointer">Groceries</Link>
            <Link href="/homedecoration" className="font-roboto cursor-pointer">Home decoration</Link>
            <Link href="/category/laptops" className="font-roboto cursor-pointer">Laptops</Link>
            <Link href="/category/mens" className="font-roboto cursor-pointer">Mens Wear</Link>
            <Link href="/category/sunglasses" className="font-roboto cursor-pointer">Sunglasses</Link>
            <Link href="/category/motorcycle" className="font-roboto cursor-pointer">Motorcycle</Link>
            <Link href="/category/vehicle" className="font-roboto cursor-pointer">Vehicle</Link>
            <Link href="/category/womens" className="font-roboto cursor-pointer">Womens wear</Link>
          </div>
        </header>
        <main>
          <aside className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
            <h2 className="mb-2 font-montserrat font-bold text-black text-lg">NEW COLLECTIONS</h2>
            <main className="grid grid-cols-5 justify-between">
              {collections.map((e,index)=>(
                <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                  <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                  <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                  <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                </Link>
              ))
              }
            </main>
          </aside>
          <aside className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
            <h2 className="mb-2 font-montserrat font-bold text-black text-lg">TOP SALES</h2>
            <main className="grid grid-cols-5 justify-between">
              {topSales.map((e,index)=>(
                <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                  <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                  <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                  <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                </Link>
              ))
              }
            </main>
          </aside>
          <aside className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
            <h2 className="mb-2 font-montserrat font-bold text-black text-lg">FREQUENTLY SEARCHED</h2>
            <main className="grid grid-cols-5 justify-between">
              {fsearch.map((e,index)=>(
                <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                  <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                  <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                  <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                </Link>
              ))
              }
            </main>
          </aside>
          <aside className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
            <h2 className="mb-2 font-montserrat font-bold text-black text-lg">MORE</h2>
            <main className="grid grid-cols-5 justify-between">
              {other.map((e,index)=>(
                <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                  <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                  <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                  <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                </Link>
              ))
              }
            </main>
          </aside>
          <aside className="bg-orange-200 rounded-sm px-10 py-3 mb-1">
            <main className="grid grid-cols-5 justify-between">
              {anothers.map((e, index)=>(
                <Link href={`./products/${e?.title.split(" ").join("")}`} key={index} className="max-w-50 cursor-pointer">
                  <img src={e?.thumbnail} alt="" className="bg-gray-300 w-50 h-50"/>
                  <p className="font-roboto text-sm mt-2 text-center truncate">{e?.title}</p>
                  <p className="text-center font-montserrat font-bold">&#8358; {(e?.price * 1000).toLocaleString()}</p>
                </Link>
              ))
              }
            </main>
          </aside>
        </main>
      </main>
    </div>
  )
}