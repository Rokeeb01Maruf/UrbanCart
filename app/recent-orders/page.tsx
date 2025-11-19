"use client"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react";
import {AlertTriangle} from "lucide-react"

type pro = {
  title: string,
  price: number,
  image: string,
  count: number
}
export default function Transactions() {
    const [log, setLog] = useState(false)
    const [products, setProducts] = useState<undefined | pro[]>(undefined)
    useEffect(()=>{
        const getSession = async() =>{
            const session = await supabase.auth.getSession()
            if(session.data.session){
                const token = session.data.session.access_token
                fetch("./api/logic?action=orders",{
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(data=>{
                    if(data){
                        console.log(data)
                        if(data.transactions == "empty"){
                            setLog(false)    
                        }else if(data.data){
                            setLog(false)
                            setProducts(data.data)
                        }
                    }else{
                        setLog(false)
                    }
                    })
                }else{
                    fetch("./api/logic?action=orders",{
                        method: "GET",
                        headers: {
                            Authorization: "undefined"
                        }
                    })
                    .then(res => res.json())
                    .then(data=>{
                        if(data){
                            console.log(data)
                            if(data.transactions == "empty"){
                                setLog(false)    
                            }else if(data.data){
                                setLog(false)
                                setProducts(data.data)
                            }
                        }else{
                            setLog(false)
                        }
                        })
            }
        }
        getSession()
    },[])
    return (
        <div className="max-h-screen overflow-y-clip">
            {
                log != true ? (
                    <div className="pt-25 gap-x-2 h-screen w-full flex justify-center items-center">
                        <AlertTriangle className="h-5 stroke-gray-800"/>
                        <p className="font-montserrat text-lg text-gray-800">Your transaction history is empty</p>
                    </div>
                )
                :
                (
                    <table className="h-full w-[85%] mt-25 flex-col mx-25  justify-center">
                         <thead className="bg-orange-300 font-montserrat font-bold">
                            <tr>
                                <th className="text-left pl-1 py-2 border-b border-gray-500">Product</th>
                                <th className="text-left px-4 py-2 border-b border-gray-500">Description</th>
                                <th className="text-left px-4 py-2 border-b border-gray-500">Price</th>
                                <th className="text-left px-4 py-2 border-b border-gray-500">Unit</th>
                                <th className="text-left px-4 py-2 border-b border-gray-500">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-orange-200 font-roboto">
                        {products?.map((e, index) => (
                            <tr key={index} className="">
                                <td className="pl-1 py-2 border-b border-gray-500">
                                    <img src={e.image} className="w-8 h-8 object-cover" />
                                </td>
                                <td className="px-2 py-2 border-b border-gray-500">{e.title}</td>
                                <td className="px-4 py-2 border-b border-gray-500">
                                    ₦ {e.price.toLocaleString()}.00
                                </td>
                                <td className="px-4 py-2 border-b border-gray-500">{e.count}</td>
                                <td className="px-4 py-2 border-b border-gray-500">
                                    ₦ {(e.price * e.count).toLocaleString()}.00
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
}