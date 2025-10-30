"use client"
import { ShoppingCart, ShoppingBag, Trash2, X, Pointer } from "lucide-react"
import { CartContext } from "./CartProvider"
import  Link  from "next/link"
import Image from "next/image"
import { useContext, useState } from "react"
export default function Header(){
  const [carts, setCarts] = useState(false)
  const [login, setLogin] = useState(false)
  const [signup, setSignup] = useState(false)
    const { cart, cartDetails, removeItem, balance } = useContext(CartContext)
    return(<>
        <header className="bg-orange-600 fixed top-0 z-50 w-full px-25 pt-7.5 pb-5 max-h-fit flex justify-between">
          <aside className="cursor-pointer flex gap-x-0.5 justify-center items-center w-fit">
            <ShoppingCart width={32} strokeWidth={3} className="text-white"/>
            <h2 unselectable="on" className="select-none font-montserrat text-white font-bold text-2xl">UrbanCart</h2>
          </aside>
          <nav className="flex font-roboto text-white text-lg justify-between gap-x-10 items-center">
                <Link href="/" className="hover:font-bold hover:text-light">Home</Link>
                <Link href="" className="hover:font-bold hover:text-light">Account</Link>
                <Link href="" className="hover:font-bold hover:text-light">Report</Link>
          </nav>
          <nav className="flex font-roboto text-white items-center text-lg justify-between gap-x-10">
                <div  onClick={()=>{
                  setCarts(!carts)
                  setLogin(false)
                  setSignup(false)
                  }} className="relative cursor-pointer hover:last:text-green-300" title="Cart">
                    <p className="absolute -top-3 -right-0.5 font-bold text-black">{cart}</p>
                    <Link href="" className="hover:font-bold"><ShoppingBag/></Link>
                </div>
                <button onClick={()=>{
                  setCarts(false)
                  setSignup(false)
                  setLogin(!login)
                }} className="hover:font-bold hover:text-light cursor-pointer">Log in</button>
                <button onClick={()=>{
                  setLogin(false)
                  setCarts(false)
                  setSignup(!signup)
                }} className="bg-blue-700 px-4 py-2 rounded-full hover:bg-blue-400 hover:font-bold">Sign Up</button>
          </nav>
          <aside className={`absolute  top-20 right-30 ${carts ? "block" : "hidden"} bg-white w-100 min-h-40 h-fit max-h-100 overflow-y-scroll py-2.5 rounded-sm shadow-sm shadow-orange-200`}>
            <header className="flex px-2  text-orange-700 font-montserrat font-bold justify-between items-center pb-2.5 border-b border-gray-300">
              <h2>Cart({cart})</h2>
              <h2>Total(&#8358;{balance.toLocaleString()}.00)</h2>
            </header>
            <div className={`w-full h-full flex flex-col`}>  
              {
                cartDetails.length != 0 ? (
                <div className="px-2 font-roboto text-sm">
                  {
                    cartDetails.map((e : {title: string, price: number, image: string, count: number})=>(
                      <div key={e.title} className="flex items-center justify-between mt-1 pb-1 border-b border-gray-300">
                        <section>
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
                  <button className="static bottom-0 bg-green-700 font-montserrat font-bold w-full
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
          <aside className={`w-100 p-2 bg-white flex flex-col ${login ? "flex" : "hidden"} items-center absolute top-20 rounded-lg h-60 right-5`}>
            <fieldset className="border-t border-gray-300 w-full">
              <legend className="mx-auto mb-2 text-gray-400 font-montserrat text-sm font-light">Log in with providers</legend>
              <header className="w-full flex justify-center gap-x-2">
                <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                  <Image src="/images/google.png" width={20} height={20} alt="google-logo"/>
                </button>
                <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                  <Image src="/images/microsoft.png" width={20} height={20} alt="microsoft-logo"/>
                </button>
                <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                  <Image src="/images/github.png" width={22} height={22} alt="github-logo"/>
                </button>
                <button className="bg-gray-300 cursor-pointer w-9.5 h-9.5 p-2.5 rounded-lg">
                  <Image src="/images/x.png" width={18} height={18} alt="x-logo"/>
                </button>
                <button className="bg-gray-300 w-9.5 h-9.5 p-1 rounded-lg">
                  <Image src="/images/facebook.png" width={30} height={30} alt="facebook"/>
                </button>
              </header>
            </fieldset>
            <fieldset className="border-y border-gray-300 w-full">
              <legend className="mx-auto m-2 text-gray-400 font-montserrat text-sm font-light">or with mail and password</legend>
              <div className="w-full">
                <input type="email" placeholder="email" className="font-roboto px-1 w-full mb-2 h-8 outline-0 border-gray-500 border rounded-sm"/>
                <input type="password" placeholder="password" className="w-full px-1 font-roboto mb-2 h-8 outline-0 border-gray-500 border rounded-sm"/>
                <button className="cursor-pointer hover:bg-blue-500 duration-300 bg-orange-500 w-full h-8 rounded-sm font-montserrat text-sm font-bold text-white">Log in</button>
              </div>
            </fieldset>
          </aside>
          <aside className={`bg-[rgba(0,0,0,0.5)] absolute w-screen h-screen inset-0 ${signup ? "flex" : "hidden"}`}>
              <div className="m-auto w-110 rounded-sm relative bg-orange-100 px-2 py-4">
              <X onClick={()=>setSignup(false)} cursor="pointer" className="absolute top-0 right-0"/>
                <header className=" w-full">
                  <p className="select-none text-center font-montserrat font-bold">Sign Up</p>
                </header>
                <main>
                  <fieldset className="border-t border-gray-300 w-full">
                    <legend className="mx-auto mb-2 text-gray-400 font-montserrat text-sm font-light">Sign up with providers</legend>
                    <header className="w-full flex justify-center gap-x-2">
                      <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                        <Image src="/images/google.png" width={20} height={20} alt="google-logo"/>
                      </button>
                      <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                        <Image src="/images/microsoft.png" width={20} height={20} alt="microsoft-logo"/>
                      </button>
                      <button className="bg-gray-300 cursor-pointer p-2.5 w-9.5 h-9.5 rounded-lg">
                        <Image src="/images/github.png" width={22} height={22} alt="github-logo"/>
                      </button>
                      <button className="bg-gray-300 cursor-pointer w-9.5 h-9.5 p-2.5 rounded-lg">
                        <Image src="/images/x.png" width={18} height={18} alt="x-logo"/>
                      </button>
                      <button className="bg-gray-300 w-9.5 h-9.5 p-1 rounded-lg">
                        <Image src="/images/facebook.png" width={30} height={30} alt="facebook"/>
                      </button>
                    </header>
                  </fieldset>
                  <fieldset className="border-y border-gray-300 w-full">
                    <legend className="mx-auto m-2 text-gray-400 font-montserrat text-sm font-light">or with mail and password</legend>
                    <div className="w-full">
                      <input type="text" placeholder="Fullname" className="px-1 mb-2 text-sm font-roboto border outline-0 border-gray-500 w-full h-8 rounded-lg"/>
                      <input type="email" placeholder="E-mail" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-8 rounded-lg"/>
                      <div className="mt-2">
                        <input type="password" placeholder="Password" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-8 rounded-lg"/>
                      </div>
                      <div className="mt-2">
                        <input type="password" placeholder="Confirm Password" className="px-1 text-sm font-roboto border outline-0 border-gray-500 w-full h-8 rounded-lg"/>
                      </div>
                      <input type="text" placeholder="Address" className="px-1 my-2 text-sm font-roboto border outline-0 border-gray-500 w-full h-8 rounded-lg"/>
                      <button className="mt-2 rounded-lg cursor-pointer duration-300 bg-orange-500 hover:bg-blue-500 w-full text-sm font-bold font-montserrat h-8 text-white">Sign Up</button>
                    </div>
                  </fieldset>
                </main>
              </div>
          </aside>
        </header>
    </>
    )
}