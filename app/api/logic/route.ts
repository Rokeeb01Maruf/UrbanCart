import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import jwt from "jsonwebtoken"

type pro = {
  title: string,
  price: number,
  image: string,
  count: number
}

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    if(action == "getProduct"){
        const newFile = await supabase.from("product").select("*")
        if(newFile.data){
            return NextResponse.json(newFile.data)
        }else{
            return NextResponse.json({error: newFile.error})
        }
    }

    if(action === "orders"){
        const authHeader =  request.headers.get("authorization")
        let userId;
        if(authHeader == "undefined"){
            const {data, error} = await supabase.auth.getUser()
            if(data.user){
                userId = data.user.id
            }
        }else if(authHeader){
           const token = authHeader.split(" ")[1]
           const decoded = jwt.verify(token, process.env.JWT_KEY)
           userId = decoded.sub
        }
            const user = await supabase.from("transactions").select("*").eq("id", userId)
            if(user.error){
                return NextResponse.json({error: user.error})
            }else if(user.data.length === 0){
                return NextResponse.json({transactions: "empty"})
            }else{
                const me :pro[] = user.data
                const data = me.map((e)=> ({image: e.image, title: e.title, price: e.price, count: e.count}))
                return NextResponse.json({data: data})
            }
    }
}

export async function POST(req: NextRequest){
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    if(action == "cart"){
        const body = await req.json()
        const id = body.id
        const newFile = await supabase.from("product").select("*")
        if(newFile.error){
            return NextResponse.json(newFile.error)
        }else{
            const data = newFile.data.filter((e)=>e.title.split(" ").join("") == id)
            return NextResponse.json({data: data})
        }
    }
    if(action === "category"){
        const {id} = await req.json()
        const newFile = await supabase.from("product").select("*")
        if(!newFile.data){
            return NextResponse.json(newFile.error)
        }else{
            const data = newFile.data.filter((e)=>e.category.split("-").join("") == id || e.category.split(" ").join("").includes(id))
            return NextResponse.json(data)
        }

    }
    if(action === "save"){
        const authHeader = req.headers.get("authorization")
        const body = await req.json()
        if(!authHeader){
            return NextResponse.json({authenticated: false})
        }else{
            const decode = authHeader.split(" ")[1]
            const token = jwt.verify(decode, process.env.JWT_KEY)
            const userId = token.sub
            const updatedBody = body.map((e :{}[])=> ({
                id: userId, ...e
            }))
            const {data, error} = await supabase.from("transactions").insert(updatedBody).select()
            if(data){
                return NextResponse.json({data: data})
            }else{
                return NextResponse.json({error: error})
            }
        }
    }
    if(action === "signup"){
        const body = await req.formData()
        const fullname = body.get("fullname") as string
        const mail = body.get("mail") as string
        const password = body.get("password") as string
        const profile = body.get("profile") as File
        const {data, error} = await supabase.auth.signUp({email: mail, password: password, options: {
            data: {
                name : fullname
            }
        }})
        if(data.user){
            const id = data.user.id
            const fileId = `${id}/${profile.name}`
            const save = await supabase.storage.from("profile").upload(fileId, profile)
            if(save.data){
                const url = supabase.storage.from("profile").getPublicUrl(fileId).data.publicUrl
                const update = await supabase.auth.updateUser({
                    data: {
                        avatar_url: url
                    }
                })
                if(update.data){
                    const data = {name: update.data.user?.user_metadata.name, mail: update.data.user?.email,
                        url: update.data.user?.user_metadata.avatar_url
                    }
                    return NextResponse.json({data: data})
                }else{
                    return NextResponse.json({error: error})
                }
            }else{
                return NextResponse.json({error: save.error})
            }
        }else{
            return NextResponse.json({error: error})
        }
    }
    if(action === "login"){
        const body = await req.json()
        const {data, error} = await supabase.auth.signInWithPassword({email: body.mail, password: body.password})
        if(data){
            const datum = {name: data.user?.user_metadata.name, mail: data.user?.email, url: data.user?.user_metadata.avatar_url}
            return NextResponse.json({data: datum})
        }else{
            return NextResponse.json({error: error})
        }
    }
}