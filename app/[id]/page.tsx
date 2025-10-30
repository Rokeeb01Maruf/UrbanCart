'use client'
import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, useContext } from "react"
import { Plus, MinusIcon, ShoppingCart, StarIcon } from "lucide-react"
import { CartContext } from "@/component/CartProvider"

type mine = {id: string, title: string, description: string, category: string, price: number, 
    discountPercentage: number, rating: number, stock: number, tags: [], brand: string, warrantyInformation :  string, 
    shippingInformation: string, availabilityStatus: string, reviews: [{rating: number, comment: string, date: string, reviewerName: string,
        reviewerEmail: string}], returnPolicy: string, images: string[],
    thumbnail: string}

export default function(){
    const { cartFunction, increaseCart, decreaseCart} = useContext(CartContext)
    const [count, setCount] = useState(1)
    const {id} = useParams()
    const [color, setColor] = useState(["white","white","white","white","white"])
    const [data, setData] = useState<mine | undefined>(undefined)
    const price = data ? Math.round((data?.price-(data?.price * (data?.discountPercentage / 100))) * 1000) : 0
    const addToCart = () => {
        const datum = {title: data?.title, image: data?.images[0], count: count, price: price} 
        cartFunction(datum)
    }
    useEffect(()=>{
        const getCart = async()=>{
            await fetch("../api/logic?action=cart",{
                method: "POST",
                body: JSON.stringify({id: id})
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.data)
                setData(data.data[0])
        })
        }
        getCart()
    },[])
    useEffect(()=>{
        if(data?.rating == undefined){
            setColor(["white","white","white","white","white"])
        }else if(data.rating > 0){
            setColor(["orange","white","white","white","white"])}

        if(data?.rating == undefined){
            setColor(["white","white","white","white","white"])
        }else if(data.rating > 1){
            setColor(["orange","orange","white","white","white"])}

        if(data?.rating == undefined){
            setColor(["white","white","white","white","white"])
        }else if(data.rating > 2){
            setColor(["orange","orange","orange","white","white"])}

        if(data?.rating == undefined){
            setColor(["white","white","white","white","white"])
        }else if(data.rating > 3){
            setColor(["orange","orange","orange","orange","white"])}

        if(data?.rating == undefined){
            setColor(["white","white","white","white","white"])
        }else if(data.rating > 4){
            setColor(["orange","orange","orange","orange","orange"])}
    },[data])
    return(
        <div className="pt-23 w-full px-25 h-fit bg-orange-100">
            <main className="mt-5">
                <nav className="flex gap-x-3 font-roboto text-sm text-gray-800 font-light">
                   <Link href="/" className="cursor-pointer">Home &gt;</Link>
                   <Link href={`../category/${data?.category}`} className="cursor-pointer">{data?.category} &gt;</Link>
                   <Link href="" className="cursor-pointer">{data?.title} &gt;</Link>
                </nav>
                <main className="grid grid-cols-3 mt-5 bg-orange-50 gap-x-5">
                    <header className="max-w-90">
                        <img src={data?.images[0]} alt="" className="rounded-sm h-90 w-90 bg-gradient-to-br from-orange-400 to-white"/>
                    </header>
                    <main>
                        <p className="font-roboto text-gray-500 font-bold mt-4">{data?.brand}</p>
                        <p className="font-montserrat font-black mt-2 text-xl">{data?.title}</p>
                        <p className="font-roboto font-light text-sm mt-5">{data?.description}</p>
                        <p className="font-roboto font-bold mt-2.5">Category: <span className="font-light">{data?.category}</span></p>
                        <p className="font-roboto font-bold mt-2.5">Discount Percentage: <span className="font-light">{data?.discountPercentage}%</span></p>
                        <div className="flex gap-x-2 items-center mt-2.5">
                            <del className="bg-gray-700 font-roboto px-4 py-1 text-white rounded-sm">&#8358;{data ? (data.price * 1000) : 0}</del>
                            <p className="font-roboto font-bold">&#8358;{price.toLocaleString()}</p>
                        </div>
                        <div className="flex mt-4 gap-x-2">
                            <aside className="flex bg-gray-200 cursor-pointer justify-between rounded-full items-center w-fit p-2">
                                <MinusIcon onClick={()=>{
                                    count > 1 ? setCount(count-1) : setCount(1);
                                    const datums = {title: data?.title}
                                    decreaseCart(datums)
                                }} className="w-5 cursor-pointer"/>
                                <input type="text" value={count} readOnly placeholder="0" disabled className="cursor-auto max-w-12.5 text-center placeholder:text-black"/>
                                <Plus onClick={()=>{
                                    setCount(count + 1)
                                    const datums = {title: data?.title}
                                    increaseCart(datums)
                                }} className="w-5 cursor-pointer"/>
                            </aside>
                            <button onClick={addToCart} className="flex cursor-pointer hover:bg-orange-400 bg-orange-600 p-2 rounded-full gap-x-1 text-white font-roboto font-medium items-center">
                                <ShoppingCart/>
                                <p>Add to Cart</p>
                            </button>
                        </div>
                    </main>
                    <footer>
                        <div className="flex font-roboto mt-4 gap-x-1"><p className="font-bold font-roboto">Rating: </p><div className="flex items-center justify-center"><StarIcon strokeWidth={0} fill={`${color[0]}`} className="w-5"/><StarIcon strokeWidth={0} fill={`${color[1]}`} className="w-5"/><StarIcon strokeWidth={0} fill={`${color[2]}`} className="w-5"/><StarIcon strokeWidth={0} fill={`${color[3]}`} className="w-5"/><StarIcon strokeWidth={0} fill={`${color[4]}`} className="w-5"/></div></div>
                        <p className="font-roboto font-bold mt-2.5">Stock: <span className="font-light">{data?.stock} units in stock</span></p>
                        <div className="flex gap-x-1 mt-2.5">
                            <p className="font-black font-roboto">Tags: </p>
                            <div className="flex gap-x-1 font-roboto">
                                {
                                data?.tags.map((e,index)=>(
                                    <p key={index} className="font-light">{e}</p>
                                ))
                                }
                            </div>
                        </div>
                        <p className="font-roboto font-bold mt-2.5">Warranty: <span className="font-light">{data?.warrantyInformation}</span></p>
                        <p className="font-roboto font-bold mt-2.5">Shipping: <span className="font-light">{data?.shippingInformation}</span></p>
                        <p className="font-roboto font-bold mt-2.5">Status: <span className="font-light">{data?.availabilityStatus}</span></p>
                        <p className="font-roboto font-bold mt-2.5">Return Policy: <span className="font-light">{data?.returnPolicy}</span></p>
                    </footer>
                </main>
            </main>
            <footer className="bg-white w-full rounded-lg mt-5 font-roboto p-1">
                <main className="border-gray-300 border rounded-lg w-full h-fit">
                    <h2 className="text-center font-montserrat font-bold border-b border-gray-300">Ratings & feedbacks</h2>
                    <div className="flex gap-x-5 justify-center py-5">
                        {
                            data?.reviews.map((e, index)=>(
                                <section key={index} className="text-sm font-roboto rounded-sm p-2 bg-blue-50 shadow-sm shadow-blue-950" >
                                    <p className="font-montserrat font-bold">{e.reviewerName}</p>
                                    <i className="text-gray-500 text-[.7rem] py-0">{e.reviewerEmail}</i>
                                    <p className="py-2">{e.comment}</p>
                                    <div className="flex">
                                        {
                                            Array.from({length: e.rating}).map((e, index)=>(
                                                <StarIcon key={index} className="stroke-0 fill-orange-500 w-4"/>
                                            ))
                                        }
                                    </div>
                                    <p className="font-light text-[.7rem]">{e.date}</p>
                                </section>
                            ))
                        }
                    </div>
                </main>
            </footer>
        </div>
    )
}