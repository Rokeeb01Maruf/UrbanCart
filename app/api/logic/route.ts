import { NextRequest, NextResponse } from "next/server"
import files from "@/data/products.json"
const mine = ["id", "title", "description", "category", "price", "discountPercentage", "rating"
    , "stock", "tags", "brand", "warrantyInformation", "shippingInformation", "availabilityStatus",
    "reviews", "returnPolicy", "images", "thumbnail"
]
const newFile = files.map((mine)=>(mine))

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    if(action == "getProduct"){
        return NextResponse.json({newFile})
    }
}

export async function POST(req: NextRequest){
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    if(action == "cart"){
        const body = await req.json()
        const id = body.id
        const data = newFile.filter((e)=>e.title.split(" ").join("") == id)
        return NextResponse.json({data: data})
    }
    if(action === "category"){
        const {id} = await req.json()
        const data = newFile.filter((e)=>e.category.split("-").join("") == id || e.category.split(" ").join("").includes(id))
        return NextResponse.json(data)
    }
}