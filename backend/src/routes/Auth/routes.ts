import Router from "express"
import { pool } from "../../config/db.js"
import bcrypt from "bcrypt"

const router = Router()
type register = {
    firstName: string, lastName: string, email: string, password: string, role: string, phone: string,
    profileUrl: string, address: string
}

router.post("/signup", async (req, res)=>{
    if(!req.body){
        return res.status(400).json({message: "Wrong request"})
    }
    const {firstName, lastName, email, password, role, phone, profileUrl, address} : register = req.body
    if(!firstName || !lastName || !password || !role || !phone || !profileUrl || !address){
        return res.status(400).json({
            message: "All field are required"
        })
    }else if(!email.includes("@") && !email.includes(".com") ){
        return res.status(400).json({message: "Invalid email"})
    }else if(password.length < 10){
        return res.status(400).json({message: "Please provide a safe password"})
    }else if(role !== "admin" && role != "customer" && role !== "vendor" && role !== "delivery"){
        return res.status(400).json({message : "Your have an unspecified role"})
    }else if(phone.length < 14 && !Number(phone)){
        return res.status(400).json({message: "Please provide a valid phone number"})
    }else{
        const paswordHash = await bcrypt.hash(password, 10)
        const existingUser = await pool.query(
            `select id from Auth where email = $1`, [email]
        )
        if(existingUser.rows.length > 0){
            res.status(401).json({message: "user already exist"})
        }    
        const store = await pool.query(
            `insert into Auth (
            first_name, last_name, email, password_hash, role, phone, profile_url, address) 
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning id, first_name, last_name, email, role, address`,
            [firstName, lastName, email, paswordHash, role, phone, profileUrl, address]
        )
        if(store.rows.length > 0){
            return res.status(200).json([{message: "Account created successfully"}, store.rows])
        }else{
            return res.status(500).json({message: "server error please contact our customer service"})
        }
    }
})


export default router