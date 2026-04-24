import Router from "express";
import { verifyToken } from "../../utils/generateToken.js";
import { pool } from "../../config/db.js";

const router = Router()
router.post("/request", async (req, res)=>{
    const header = req.headers
    const body = req.body
    if(!header || !body){
        res.status(401).json({message: "Unauthorized request"})
    }
    const bearerToken = header.authorization
    if(!bearerToken){
        return res.status(401).json({message: "Unauthorized request"})
    }
    const unverified = bearerToken.split(" ")[1]
    if(!unverified){
        return res.status(401).json({message: "unverified request"})
    }
    const token = verifyToken(unverified)
    const id = token.id
    const verifyId = await pool.query(`
        select email_verification from auth where id = $1
        `, [id])
    if(verifyId.rows.length < 1){
        return res.status(403).json({message: "invalid credentials"})
    }else if(verifyId.rows[0].email_verification == false){
        return res.status(403).json({message: "invalid credentials"})
    }
    const request = await pool.query(`
        insert into vendors-request (userid, name, profile_url, address, details,verification_status)
        values($1, $2, $3, $4, $5, $6)
        returning *
        `, [id, body.name, body.profileUrl, body.address, body.details, "pending"])
    return res.status(200).json(request.rows[0])
})


export default router
