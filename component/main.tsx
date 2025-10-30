import { ArrowRight } from "lucide-react"
export default function Head({img, handleClick}:{img: string[], handleClick: ()=>void}){
  return(
    <div className="bg-light min-h-full mt-20 w-full">
      <header className="flex bg-orange-600 px-25 items-center gap-x-5">
        <aside className=" font-roboto text-2xl text-gray-200">
          <h2 className="font-montserrat font-bold underline mb-10">Top Deal</h2>
          <p>Discover everyday essentials and statement pieces that define your style. Shop the latest
            urban fashion, gadgets, and lifestyle products all in one cart.</p>
            <button onClick={handleClick} className="text-purple-800 flex mt-5 items-center cursor-pointer">Explore<ArrowRight /></button>
        </aside>
        <aside className="">
          <main className="flex relative max-w-100 mt-20 mb-10 mr-20">
            <img src={img[0]} alt="" className="bg-gray-200 max-w-90 z-20 cursor-pointer"/>
            <img src={img[1]} alt="" className="bg-gray-400 max-w-90 absolute z-10 -top-5 cursor-pointer -right-10"/>
            <img src={img[2]} alt="" className="bg-gray-600 cursor-pointer max-w-90 absolute z-0 -top-10 -right-20"/>
          </main>
        </aside>
      </header>
    </div>
    )
}