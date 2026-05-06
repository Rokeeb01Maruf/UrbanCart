import Router from "express";
import { pool } from "../../../config/db.js";
import { verifyToken } from "../../../utils/generateToken.js";

const router = Router()

router.post("/vendors-request", async (req, res)=>{
    const header = req.headers
    if(!header){
        return res.status(403).json({message: "Unauthorized request"})
    }
    const bearerToken = header.authorization as string
    const bearer = bearerToken.split(" ")[1]
    if(!bearer){
        return res.status(400).json({message: "Unauthorized request"})
    }
    const token = verifyToken(bearer).id as string
    const verifyId = await pool.query(`
        select role from auth where id = $1
        `, [token])
    if(verifyId.rows.length < 1){
        return res.status(403).json({message: "Unauthorized request"})
    }
    if(verifyId.rows[0].role !== "admin"){
        return res.status(403).json({message: "Unauthorized access"})
    }
    const verifyVendors = await pool.query(`
        select * from vendors_request where verification_status = 'pending'`)
    if(verifyVendors.rows.length < 1){
        return res.status(200).json({message: "no unverified vendor"})
    }else{
        return res.status(200).json([{message: `${verifyVendors.rows.length} unverified vendors`},
            verifyVendors.rows
        ])
    }
})

router.patch("/approve/:id", async (req, res)=>{
    const header = req.headers
    if(!header) return res.status(400).json({message: "invalid credentials"})
    const bearerToken = header.authorization
    if(!bearerToken) return res.status(400).json({message: "invalid credentials"})
    const token = bearerToken.split(" ")[1]
    if(!token) return res.status(400).json({message: "invalid credentials"})
    const id = verifyToken(token).id
    const validateId = await pool.query(`
        select role from auth where id = $1 and role = 'admin'
        `,[id])
    if(validateId.rows.length < 1) return res.status(403).json({message: "Unauthorized request"})
    const vId = req.params.id as string
    if(!vId) return res.status(403).json({message: "Forbidden request"})
    const approve = await pool.query(`
        update vendors_request set verification_status = 'verified' where id = $1
        returning *
        `, [vId])
    if(approve.rows.length < 1 || !approve.rows) return res.status(400).json({message: "Make vending request"})
    const validateVendor = await pool.query(`
        update auth set role = 'vendor' where id = $1
        returning *
        `, [approve.rows[0].userid])
    if(validateVendor.rows.length < 1) return res.json({message: 'server error'})
        const registerBusiness = await pool.query(`
            insert into vendor (userid, name, profile_url, address, details, verification_status)
            values ($1, $2, $3, $4, $5, $6) returning *
            `, [approve.rows[0].userid, approve.rows[0].name, approve.rows[0].profile_url, 
        approve.rows[0].address, approve.rows[0].details, approve.rows[0].verification_status])
        if(registerBusiness.rows.length < 1) return res.status(500).json({message: "Server error, failed to register vendor"})
    return res.status(200).json([{message: `${registerBusiness.rows[0].name} has been approved`},
 registerBusiness.rows[0]])
})

router.post("/vendors", async (req, res)=>{
    const header = req.headers
    if(!header){
        return res.status(403).json({message: "Unauthorized request"})
    }
    const bearerToken = header.authorization as string
    const bearer = bearerToken.split(" ")[1]
    if(!bearer){
        return res.status(400).json({message: "Unauthorized request"})
    }
    const token = verifyToken(bearer).id as string
    const verifyId = await pool.query(`
        select role from auth where id = $1
        `, [token])
    if(verifyId.rows.length < 1){
        return res.status(403).json({message: "Unauthorized request"})
    }
    if(verifyId.rows[0].role !== "admin"){
        return res.status(403).json({message: "Unauthorized access"})
    }
    const getVendors = await pool.query(`select * from vendor`)
    if (getVendors.rows.length === 0) return res.status(200).json({message: "Empty vendors list"})
    return res.status(200).json([{message: "vendor's list fetched successfully"}, getVendors.rows])
})
export default router