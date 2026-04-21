import Router from "express"
import { pool } from "../../config/db.js"
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../../utils/generateToken.js"
import { sendMail } from "../../utils/sendMail.js"

const router = Router()
type register = {
    firstName: string, lastName: string, email: string, password: string, phone: string,
    profileUrl: string, address: string
}

router.post("/signup", async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Wrong request" })
    }
    const { firstName, lastName, email, password, phone, profileUrl, address }: register = req.body
    if (!firstName || !lastName || !password || !phone || !profileUrl || !address) {
        return res.status(400).json({
            message: "All field are required"
        })
    } else if (!email.includes("@") && !email.includes(".com")) {
        return res.status(400).json({ message: "Invalid email" })
    } else if (password.length < 10) {
        return res.status(400).json({ message: "Please provide a safe password" })
    } else if (phone.length < 14 || isNaN(Number(phone))) {
        return res.status(400).json({ message: "Please provide a valid phone number" })
    } else {
        const paswordHash = await bcrypt.hash(password, 10)
        const existingUser = await pool.query(
            `select id from Auth where email = $1`, [email]
        )
        if (existingUser.rows.length > 0) {
            return res.status(401).json({ message: "user already exist" })
        }
        const role = "customer"
        const store = await pool.query(
            `insert into Auth (
            first_name, last_name, email, password_hash, role, phone, profile_url, address) 
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning id, email`,
            [firstName, lastName, email, paswordHash, role, phone, profileUrl, address]
        )
        if (store.rows.length > 0) {
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
            return res.status(200).json([
                { message: "Account created successfully" },
                { token: emailToken }
            ])
        } else {
            return res.status(500).json(
                { message: "server error please contact our customer service" }
            )
        }
    }
})

router.get("/verify-email", async (req, res) => {
    const token = req.query.token as string
    if (!token) {
        return res.status(400).json({ message: "Wrong request" })
    }
    const tokenData = verifyToken(token)
    const verifyMail = await pool.query(
        `update auth set email_verification = true where id= $1 
        returning email_verification`,
        [tokenData.id]
    )
    if (verifyMail.rows.length > 0) {
        return res.status(200).json({ message: "Email verified successfully" })
    } else {
        return res.status(500).json({ message: "server error please contact our customer service" })
    }
})

router.post("/signin", async (req, res) => {
    type signin = { email: string, password: string }
    if (!req.body) {
        return res.status(401).json({ message: "Wrong Request" })
    }
    const { email, password }: signin = req.body
    if (!email.includes("@") || !email.includes(".com")) {
        return res.status(400).json({ message: "Invalid credential" })
    }
    const verify = await pool.query(
        `select * from auth where email = $1
        `, [email]
    )
    if (verify.rows.length < 1) {
        return res.status(400).json({ message: "Invalid credential" })
    } else if (verify.rows[0].email_verification == false) {
        return res.status(403).json({ message: "Please verify your email and try later" })
    } else {
        const hashPwd = verify.rows[0].password_hash
        const match = await bcrypt.compare(password, hashPwd)
        if (!match) {
            return res.status(401).json({ message: "wrong password" })
        }
        const token = generateToken(verify.rows[0].id)
        return res.status(200).json([
            { message: "login successful" },
            token
        ])
    }
})

router.get("/me", async (req, res) => {
    const token = req.headers
    if (!token.authorization) {
        return res.status(403).json({ message: "Authorization is required" })
    } else {
        const tokenStr = token.authorization as string
        const tokenId = tokenStr.split(" ")[1]
        if (!tokenId) {
            return res.status(401).json({ message: "unauthorized access" })
        }
        const tokenVerify = verifyToken(tokenId)
        const checkToken = await pool.query(
            `
            select * from auth where id = $1
            `, [tokenVerify.id]
        )
        if (checkToken.rows.length < 1) {
            return res.status(401).json({ message: "unauthorized" })
        }
        const data = checkToken.rows[0]
        const resData = {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            phone: data.phone,
            profileUrl: data.profile_url,
            address: data.address
        }
        return res.status(200).json([{ message: "Authorized" }, resData])
    }
})


export default router