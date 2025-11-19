"use client"
import { ShoppingCart, ShoppingBag, Trash2, X, LogOut, ImageUp, AlertCircle} from "lucide-react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { CartContext } from "./CartProvider"
import  Link  from "next/link"
import Image from "next/image"
import React, { useContext, useEffect, useState } from "react"
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}


export default function Header(){
  const [success, setSuccess] = useState(false)
  const [p, setP] = useState(false)
  const [overlay, setOverLay] = useState(false)
  const [data, setData] = useState({mail: "", password: ""})
  const [logOut, setLogOut] = useState(false)
  const [valid, setValid] = useState(false)
  const [fail, setFail] = useState(false)
  const [name, setName] = useState(false)
  const [password, setPassword] = useState(false)
  const [mail, setMail] = useState(false)
  const [trackingId, setTracking] = useState("")
  const [detail, setDetail] = useState<{fullname: string, mail: string, password: string, profile: Blob | undefined}>
  ({fullname: "", password: "", mail: "", profile: undefined})
  const [confirm, setConfirm] = useState([undefined, "Click to upload"])
  type details = {
    name: string, mail : string, url: string
  }
  const handleSignUp = async(provider: 'google' | 'github' | 'facebook' | 'twitter' | 'azure') => {
   await supabase.auth.signInWithOAuth({ provider: provider });
  }
  const transact = async() =>{
    const randomId = Math.random().toString(36).toLocaleUpperCase().substring(2)
    const session = await supabase.auth.getSession()
    if(session.data.session?.user){
      const token = session.data.session.access_token
      await fetch("/api/logic?action=save",{
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cartDetails)
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.data){
          setSuccess(true)
          setTracking(randomId)
        }else{
          setSuccess(false)
        }
      })
    }
  }

  const handleLogIn = async() =>{
    setValid(false)
      if(data.mail.includes("@") && data.mail.includes(".com") && data.password.length == 11){
        await fetch("/api/logic?action=login",{
          method: "POST",
          body: JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.data){
            setLogin(false)
            setProfile(data.data)
          }else{
            setOverLay(true)
          }
        })
      }else{
          setOverLay(true)
      }
    }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const data = e.target.files?.[0]
    if(data){
      const newDetails = {...detail}
      newDetails.profile = data
      setDetail(newDetails)
      const url = URL.createObjectURL(data)
      setConfirm([url, "Change"])
    }
  }
  const handlePayment = () => {
    if(profile?.mail){
      setP(false)
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: profile.mail,
        amount: balance * 100,
        currency: "NGN",
        callback: function (response: any){
          if(response.message === "Approved" && response.status == "success"){
            transact()
          }
        },
        onClose: function (){
          alert("aborted")
        }
      })
      handler.openIframe()
    }else{
      setP(true)
    }
  }

  const handleMail = (e :React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value
    if(!value.includes(".com") && !value.includes("@")){
      setMail(true)
    }else if(value.includes(".com") && value.includes("@")){
      const newDetails = {...detail}
      newDetails.mail = value
      setDetail(newDetails)
      setMail(false)
    }
    
  }

  const handlePassword = (e :React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value
    if(value.length == 11){
      const newDetails = {...detail}
      newDetails.password = value
      setDetail(newDetails)
      setPassword(false)
    }else{
      setPassword(true)
    }
  }

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if(value != detail.password){
      setFail(true)
    }else if(value.length != 11){
      setFail(true)
    }else{
      setFail(false)
    }
  }

  const handleName = (e :React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if(value){
      const newDetails = {...detail}
      newDetails.fullname = value
      setDetail(newDetails)
      setName(false)
    }else if(value == ""){
      setName(true)
    }
  }
  const handleSubmit = async(e :React.MouseEvent<HTMLButtonElement>) =>{
    if(valid == false){
      e.preventDefault()
    }else{
      const formdata = new FormData()
      if(detail.profile){
        formdata.append("fullname",detail.fullname)
        formdata.append("mail",detail.mail)
        formdata.append("password",detail.password)
        formdata.append("profile",detail.profile)
      }
      fetch("/api/logic?action=signup",{
        method: "POST",
        body: formdata
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.data){
          setSignup(false)
          setProfile(data.data)
      }else{
        setProfile(undefined)
        console.log(data)
      }})

    }
  }
  useEffect(()=>{
    if(detail.fullname != "" && detail.mail != "" && detail.mail.includes(".com") && detail.mail.includes("@")
    && detail.password.length == 11 && detail.profile != undefined && fail == false){
      setValid(true)
    }else{
      setValid(false)
    }
  },[detail, fail])
  const [carts, setCarts] = useState(false)
  const pathName = usePathname()
  const [login, setLogin] = useState(false)
  const [signup, setSignup] = useState(false)
  const [profile, setProfile] = useState<undefined | details>(undefined)
  const [info, setInfo] = useState(false)
  const { cart, cartDetails, removeItem, balance, emptyCart } = useContext<any>(CartContext)
  const cartList :[{title: string,image: string, count: number, price: number}] = cartDetails
  const handleLogout = () =>{
    try{
      supabase.auth.signOut()
    }catch(err){
      console.log("error",err)
    }
    setLogOut(false)
    getUserInfo()
  }
  const getUserInfo = async()=>{
    const { data } = supabase.auth.onAuthStateChange((event, session)=>{
      console.log(session)
      if(event === "SIGNED_IN"){
        setProfile({name: session?.user.user_metadata.name, mail: session?.user.user_metadata.email, 
          url: session?.user.user_metadata.avatar_url
        })
      }else{
        setProfile(undefined)
      }
    })
    return()=>{
      data.subscription.unsubscribe()
    }
  }
  useEffect(()=>{
    getUserInfo()
  },[])
    return(<div className="w-full h-full relative">
      {
        success == true ? (
          <div className="max-w-screen absolute h-screen bg-[rgba(225,225,225,0.1)] z-1050 justify-center items-center inset-0 flex backdrop-blur-md">
            <div className="w-100 shadow-lg bg-white rounded-lg">
              <header className="w-full text-center my-2">
                <p className="text-lg font-montserrat font-bold">Order status</p>
              </header>
              <main className="w-full flex gap-x-2 overflow-x-scroll justify-center items-center">
                {
                  cartList.map((e,index)=>(
                    <div key={index} className="border p-4 border-gray-300 w-fit flex flex-col justify-center items-center">
                      <img src={e.image} className="bg-orange-400 rounded-sm w-50 h-50"/>
                      <div className="font-roboto w-full text-start">
                        <h2 className="text-lg font-bold">{e.title}</h2>
                        <p className="text-gray-500">&#8358;{e.price.toLocaleString()}.00</p>
                        <p className="text-orange-500">Unit: {e.count}</p>
                      </div>
                    </div>
                  ))
                }
              </main>
              <footer className="px-5 w-full text-center font-roboto">
                <p className="text-green-500 font-montserrat font-bold">Your order has been placed</p>
                <p className="text-sm mb-2">You can copy the tracking id <span className="underline cursor-pointer text-gray-400">{trackingId}</span></p>
                <button onClick={()=>{
                  setSuccess(false)
                  emptyCart()
                }} className="border mb-3 hover:bg-green-500 hover:text-white border-gray-300 px-4 py-1 rounded-full cursor-pointer">Close</button>
              </footer>
            </div>
          </div>
        ):null
      }
        <header className="bg-orange-600 fixed top-0 z-50 w-full px-25 pt-7.5 pb-5 max-h-fit flex justify-between">
          <aside className="cursor-pointer flex gap-x-0.5 justify-center items-center w-fit">
            <ShoppingCart width={32} strokeWidth={3} className="text-white"/>
            <h2 unselectable="on" className="select-none font-montserrat text-white font-bold text-2xl">UrbanCart</h2>
          </aside>
          <nav className="flex font-roboto text-white text-lg justify-between gap-x-10 items-center">
                <Link href="/" className="hover:font-bold hover:text-light">Home</Link>
                <button onClick={()=>{
                    setCarts(false)
                    setSignup(false)
                    setLogin(false)
                    setInfo(!info)
                  }} className="hover:font-bold hover:text-light">Account</button>
                <Link href="" className="hover:font-bold hover:text-light">Report</Link>
          </nav>
          <nav className="flex font-roboto text-white items-center text-lg justify-between gap-x-10">
                <div  onClick={()=>{
                  setCarts(!carts)
                  setLogin(false)
                  setSignup(false)
                  setLogOut(false)
                  }} className="relative cursor-pointer hover:last:text-green-300" title="Cart">
                    <p className="absolute -top-3 -right-0.5 font-bold text-black">{cart}</p>
                    <Link href="" className="hover:font-bold"><ShoppingBag/></Link>
                </div>
                {
                  profile === undefined ? (
                <button onClick={()=>{
                  setCarts(false)
                  setSignup(false)
                  setLogin(!login)
                  setValid(true)
                  setInfo(false)
                  setLogOut(false)
                }} className="hover:font-bold hover:text-light cursor-pointer">Log in</button>
                  ):(
                    <Link href={"/recent-orders"} className={pathName == "/transactions" ? "bg-blue-700 px-4 py-2 rounded-full hover:bg-blue-400 hover:font-bold" : "font-roboto font-normal"}>Recent Orders</Link>
                  )
                }
                
                {
                  profile == undefined ? (
                    <button onClick={()=>{
                      setInfo(false)
                      setLogin(false)
                      setCarts(false)
                      setLogOut(false)
                      setSignup(!signup)
                      setValid(false)
                    }} className="bg-blue-700 px-4 py-2 rounded-full hover:bg-blue-400 hover:font-bold">Sign Up</button>
                  ) : (<button onClick={()=>{
                        setCarts(false)
                        setSignup(false)
                        setLogin(false)
                        setInfo(false)
                        setLogOut(!logOut)
                  }} className="relative">
                    <img src={profile.url} alt="" className="cursor-pointer w-8 h-8 rounded-full border"/>
                    { info ? 
                      (<div className="absolute top-10 p-2 rounded-sm gap-x-2 right-120 bg-white w-70 flex">
                      <img src={profile.url} alt="" className="rounded-sm w-16"/>
                      <div className="font-bold text-left text-sm text-black">
                        <h2 className="font-montserrat">{profile.name}</h2>
                        <h2 className="font-light font-roboto">{profile.mail}</h2>
                      </div>
                    </div>):null
                    }
                  </button>) 
                }
                
          </nav>
          <aside className={`absolute top-20 right-30 ${carts ? "block" : "hidden"} bg-white w-100 min-h-40 h-fit max-h-100 py-2.5 rounded-sm shadow-sm shadow-orange-200`}>
            <header className="flex px-2  text-orange-700 font-montserrat font-bold justify-between items-center pb-2.5 border-b border-gray-300">
              <h2>Cart({cart})</h2>
              <h2>Total(&#8358;{balance.toLocaleString()}.00)</h2>
            </header>
            <div className={`w-full h-full flex flex-col overflow-y-scroll relative`}>  
              {
                cartDetails.length != 0 ? (
                <div className="px-2 font-roboto text-sm relative">
                  {
                    p  ? (<p className="absolute text-white px-2 py-0 text-sm rounded-full bg-red-500 z-50 top-12 left-30">Please Log in first</p>)
                    : null
                  }
                  {
                    cartDetails.map((e : {title: string, price: number, image: string, count: number})=>(
                      <div key={e.title} className="flex items-center justify-between mt-1 pb-1 border-b border-gray-300">
                        <section className="bg-orange-500 rounded-sm">
                          <img src={e.image} width={48} height={48} alt="Product image"/>
                        </section>
                        <section className="">
                          <aside className="">
                            <p className="font-bold text-orange-700">
                              {e.title}
                            </p>
                          </aside>
                          <aside className="flex gap-x-2 items-center">
                            <p>&#8358;{e.price.toString()}.00</p>
                            <p>X</p>
                            <p>{e.count}</p>
                            <p>&#8358;{(e.price * e.count).toLocaleString()}.00</p>
                          </aside>
                        </section>
                        <section>
                          <button onClick={()=>removeItem({title: e.title})}>
                            <Trash2 strokeWidth={2.3} className="text-red-600 cursor-pointer"/>
                          </button>
                        </section>
                      </div>
                    ))
                  }
                  <button onClick={handlePayment} className="bg-green-700 font-montserrat font-bold w-full
                   text-white left-0 h-8 flex items-center cursor-pointer rounded-full justify-center
                   hover:bg-green-400">Place Order</button>
                </div>
                ) 
                : 
                (<div className="w-full h-full flex items-center justify-center">
                  <p className=" text-gray-400 font-bold font-roboto">Empty</p>
                </div>)
              }
            </div>
          </aside>
          {
            login ? (
              <aside className="w-100 p-2 bg-white flex flex-col items-center absolute top-20 rounded-lg h-60 right-5">
                {
                  overlay ? (
                    <div className="absolute bg-white rounded-lg inset-0 w-full h-full flex flex-col justify-center items-center">
                      <X cursor="pointer" onClick={()=>setOverLay(false)} className="absolute top-2 right-2"/>
                      <div className="bg-red-600 w-25 h-25 p-5 flex rounded-full">
                        <X  stroke="white" strokeWidth={3} className="w-full h-full"/>
                      </div>
                      <h2 className="font-montserrat mt-3 text-gray-600">Please input a valid email and password</h2>
                    </div>
                  ):null
                }
                <fieldset className="border-t border-gray-300 w-full">
                  <legend className="mx-auto mb-2 text-gray-400 font-montserrat text-sm font-light">Log in with providers</legend>
                  <header className="w-full flex justify-center gap-x-2">
                    <button onClick={()=>handleSignUp('google')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                      <Image src="/images/google.png" width={20} height={20} alt="google-logo"/>
                    </button>
                    <button onClick={()=>handleSignUp('github')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                      <Image src="/images/github.png" width={22} height={22} alt="github-logo"/>
                    </button>
                    <button onClick={()=>handleSignUp('twitter')} className="bg-gray-300 cursor-pointer w-9.5 h-9.5 p-2.5 rounded-lg">
                      <Image src="/images/x.png" width={18} height={18} alt="x-logo"/>
                    </button>
                    <button onClick={()=>handleSignUp('facebook')} className="bg-gray-300 w-9.5 h-9.5 p-1 rounded-lg">
                      <Image src="/images/facebook.png" width={30} height={30} alt="facebook"/>
                    </button>
                    <button onClick={()=>handleSignUp('google')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                      <Image src="/images/microsoft.png" width={20} height={20} alt="microsoft-logo"/>
                    </button>
                  </header>
                </fieldset>
                <fieldset className="border-y border-gray-300 w-full">
                  <legend className="mx-auto m-2 text-gray-400 font-montserrat text-sm font-light">or with mail and password</legend>
                  <div className="w-full">
                    <input type="email" onInput={(e :React.ChangeEvent<HTMLInputElement>)=>{
                        const val = e.target.value
                        const newData = {...data}
                        newData.mail = val
                        setData(newData)
                    }} placeholder="email" className="font-roboto px-1 w-full mb-2 h-8 outline-0 border-gray-500 border rounded-sm"/>
                    <input onInput={(e :React.ChangeEvent<HTMLInputElement>)=>{
                        const val = e.target.value
                        const newData = {...data}
                        newData.password = val
                        setData(newData)
                    }} type="password" placeholder="password" className="w-full px-1 font-roboto mb-2 h-8 outline-0 border-gray-500 border rounded-sm"/>
                    <button type="submit" onClick={handleLogIn} className={`mt-2 rounded-lg ${ valid == true ? "cursor-pointer bg-orange-500 duration-300  hover:bg-blue-500" : "cursor-not-allowed bg-orange-300"}    w-full text-sm font-bold font-montserrat h-8 text-white`}>Log in</button>
                  </div>
                </fieldset>
              </aside>
            ):null
          }
          {
            logOut ? (
              <div className="w-fit z-10 absolute top-17   right-25 ">
                <button type="submit" onClick={handleLogout} className="flex w-full h-full py-3 cursor-pointer rounded-sm px-2 justify-center bg-white items-center gap-x-2">
                  <LogOut />
                  <p className="font-montserrat font-bold">Log Out</p>
                </button>
              </div>
            ):null
          }
          {
            signup ? (
              <aside className="bg-[rgba(0,0,0,0.5)] absolute w-screen h-screen inset-0 flex">
                  <div className="m-auto w-100 rounded-sm relative bg-orange-100 px-2 py-4">
                  <X onClick={()=>{
                    setSignup(false)
                    setDetail({fullname : "", mail: "", password: "", profile : undefined})
                    }} cursor="pointer" className="absolute top-0 right-0"/>
                    <header className=" w-full">
                      <p className="select-none text-center font-montserrat font-bold">Sign Up</p>
                    </header>
                    <main>
                      <fieldset className="border-t border-gray-300 w-full">
                        <legend className="mx-auto mb-2 text-gray-400 font-montserrat text-sm font-light">Sign up with providers</legend>
                        <header className="w-full flex justify-center gap-x-2">
                          <button onClick={()=>handleSignUp('google')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                            <Image src="/images/google.png" width={20} height={20} alt="google-logo"/>
                          </button>
                          <button onClick={()=>handleSignUp('azure')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                            <Image src="/images/microsoft.png" width={20} height={20} alt="microsoft-logo"/>
                          </button>
                          <button onClick={()=>handleSignUp('github')} className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                            <Image src="/images/github.png" width={22} height={22} alt="github-logo"/>
                          </button>
                          <button onClick={()=>handleSignUp('twitter')} className="bg-gray-300 cursor-pointer w-9.5 h-9.5 p-2.5 rounded-lg">
                            <Image src="/images/x.png" width={18} height={18} alt="x-logo"/>
                          </button>
                          <button className="bg-gray-300 w-9.5 h-9.5 p-1 rounded-lg">
                            <Image src="/images/facebook.png" width={30} height={30} alt="facebook"/>
                          </button>
                        </header>
                      </fieldset>
                      <fieldset className="border-y border-gray-300 w-full">
                        <legend className="mx-auto m-2 text-gray-400 font-montserrat text-sm font-light">or with mail and password</legend>
                        <div className="w-full flex flex-col px-4">
                          <label htmlFor="upload" className="mx-auto mb-2 flex items-center flex-col w-fit cursor-pointer">
                            {
                              confirm[0] != undefined ? (
                                <img src={confirm[1]} className="w-12.5 h-12.5 rounded-full" alt="" />
                              ):(
                                <ImageUp className="" width={50} height={30}/>
                              )
                            }
                            <p className="font-montserrat text-sm">{confirm[1]}</p>
                            <input type="file" accept="image/*" className="hidden" name="upload" id="upload" onChange={handleImage}/>
                          </label>
                          <div className="mt-2">
                            <input onBlur={handleName} type="text" placeholder="Fullname" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-10 rounded-lg"/>
                            {
                              name ? (
                                <p className="text-red-500 items-center font-roboto text-sm flex gap-x-0.5">
                                  <AlertCircle className="w-3"/>
                                  This field can't be empty
                                </p>
                              ):null
                            }
                          </div>
                          <div className="mt-2">
                            <input onChange={handleMail} type="email" placeholder="E-mail" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-10 rounded-lg"/>
                            {
                              mail ? (
                                <p className="text-red-500 items-center font-roboto text-sm flex gap-x-0.5">
                                  <AlertCircle className="w-3"/>
                                  Please provide a valid mail
                                </p>
                              ):null
                            }
                          </div>
                          <div className="mt-2">
                            <input maxLength={11} onChange={handlePassword} type="password" placeholder="Password" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-10 rounded-lg"/>
                            {
                              password ? (
                                <p className="text-red-500 items-center font-roboto text-sm flex gap-x-0.5">
                                  <AlertCircle className="w-3"/>
                                  Your password must be 11 character long
                                </p>
                              ):null
                            }
                          </div>
                          <div className="mt-2">
                            <input onChange={validatePassword} maxLength={11} type="password" placeholder="Confirm Password" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-10 rounded-lg"/>
                            {
                              fail ? (
                                <p className="text-red-500 items-center font-roboto text-sm flex gap-x-0.5">
                                  <AlertCircle className="w-3"/>
                                  Your passwords doesn't match
                                </p>
                              ):null
                            }
                          </div>
                          {
                            detail.profile == undefined ? (
                              <p className="text-red-500 items-center font-roboto text-sm flex gap-x-0.5">
                                <AlertCircle className="w-3"/>
                                upload profile
                              </p>
                            ):null
                          }
                          <button type="submit" onClick={handleSubmit} className={`mt-2 rounded-lg ${ valid == true ? "cursor-pointer bg-orange-500 duration-300  hover:bg-blue-500" : "cursor-not-allowed bg-orange-300"}    w-full text-sm font-bold font-montserrat h-8 text-white`}>Sign Up</button>
                        </div>
                      </fieldset>
                    </main>
                  </div>
              </aside>
            ): null
          }
        </header>
    </div>
    )
}