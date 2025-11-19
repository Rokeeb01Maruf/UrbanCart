"use client"
import {createContext, useEffect, useState} from "react"
type contentType = {
    cart: number,
    cartDetails: object[],
    cartFunction: (data: {title: string})=>void,
    increaseCart: (data: {title: string})=>void,
    decreaseCart: (data: {title: string})=>void,
    removeItem: (data: {title: string})=> void,
    emptyCart: ()=> void,
    balance: number
}
export const CartContext = createContext<contentType | undefined>(undefined)
export const CartProvider = ({children} : Readonly<{children: React.ReactNode}>) => {
    const [cart, setCart] = useState(0)
    const [balance, setBalance] = useState(0)
    const [cartDetails, setCartDetails] = useState<[{title: string, price: number, count: number}] | []>([])
    const cartFunction = (data : {title: string}) =>{
        const sameData = cartDetails.find((e)=>(e.title == data.title))
        if(!sameData){
            const updated :any= [data, ...cartDetails]
            setCartDetails(updated)
            setCart(updated.length)
        }else{
            const updatedCart :any= cartDetails.map(item => item.title === data.title ? data : item)
            setCartDetails(updatedCart)
        }
    }
    const increaseCart = (data :{title: string}) =>{
        const newData :any= cartDetails.find((e)=> e.title === data.title)
        if(newData){
            newData.count = newData.count + 1
            const upDateCart :any= cartDetails.map(e=> e.title == newData?.title ? newData : e)
            setCartDetails(upDateCart)
        }
    }
    const decreaseCart = (data :{title: string}) =>{
        const newData :any = cartDetails.find((e)=> e.title === data.title)
        if(newData){
            if(newData.count > 1){
                newData.count = newData.count - 1
                const upDateCart :any= cartDetails.map(e=> e.title == newData?.title ? newData : e)
                setCartDetails(upDateCart)
            }
        }
    }
    const removeItem = (data: {title: string}) => {
        const removeData :any = cartDetails.filter((e)=> e.title !== data.title)
        setCartDetails(removeData)
        setCart(removeData.length)
    }
    const emptyCart = () => {
        setCartDetails([])
        setCart(0)
    }
    useEffect(()=>{
        if(cartDetails.length != 0){
            for(let i=0; i<cartDetails.length; i++){
                const total = cartDetails.reduce((sum, value) => sum + (cartDetails[i].price * cartDetails[i].count), 0)
                setBalance(total)
            }
        }else{
            setBalance(0)
        }
    },[cartDetails])
    return(
        <CartContext.Provider value={{cart, cartDetails, cartFunction, decreaseCart, increaseCart, removeItem, balance, emptyCart}}>
            {children}
        </CartContext.Provider>
    )
}