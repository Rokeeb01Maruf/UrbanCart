import Router from "express"
import { pool } from "../../config/db.js"
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../../utils/generateToken.js"
import { sendMail } from "../../utils/sendMail.js"

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
    }else if(phone.length < 14 || isNaN(Number(phone))){
        return res.status(400).json({message: "Please provide a valid phone number"})
    }else{
        const paswordHash = await bcrypt.hash(password, 10)
        const existingUser = await pool.query(
            `select id from Auth where email = $1`, [email]
        )
        if(existingUser.rows.length > 0){
            return res.status(401).json({message: "user already exist"})
        }    
        const store = await pool.query(
            `insert into Auth (
            first_name, last_name, email, password_hash, role, phone, profile_url, address) 
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning id, email`,
            [firstName, lastName, email, paswordHash, role, phone, profileUrl, address]
        )
        if(store.rows.length > 0){
            const emailToken = generateToken(store.rows[0].id)
            const verifyEmail = `http://localhost:5000/auth/verify-email?token=${emailToken}`
            await sendMail(store.rows[0].email, "Email Verification",
                 `<h2 style="color: green;">Welcome to UrbanCart</h2>
                 <p>Please click the link below to verify your email</p><br/>
                 <a href=${verifyEmail} style="color: white; background-color: blue; padding: 10px 20px;
                 border-radius: 20px; margin-bottom: 10px; cursor: pointer;
                 ">Confirm email</a>
                 <br/><br/><br/>
                 `
                )
            return res.status(200).json([{message: "Account created successfully"}, {token: emailToken}])
        }else{
            return res.status(500).json({message: "server error please contact our customer service"})
        }
    }
})

router.get("/verify-email", async (req, res)=>{
    const token = req.query.token as string
    if(!token){
        return res.status(400).json({message: "Wrong request"})
    }
    const tokenData = verifyToken(token)
    const verifyMail = await pool.query(
        `update auth set email_verification = true where id= $1 returning email_verification`, [tokenData.id]
    )
    if(verifyMail.rows.length > 0){
        return res.status(200).json({message: "Email verified successfully"})
    }else{
        return res.status(500).json({message: "server error please contact our customer service"})
    }
})


export default router