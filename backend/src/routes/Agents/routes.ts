import { Router } from "express";
import { verifyToken } from "../../utils/generateToken.js";
import { pool } from "../../config/db.js";

const router = Router()
router.post("/request", async (req, res)=>{
    const header  = req.headers
    if(!header) return res.status(400).json({message: "Bad Request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad Request"})
    const token = bearerToken.split(" ")[1]
    if(!token) return res.status(400).json({message: "Bad Request"})
    const tokenId = verifyToken(token)
    if(!tokenId) return res.status(403).json({message: "Forbidden request"})
    const id = tokenId.id 
    if(!id) return res.status(400).json({message: "Forbidden request"})
    const verify = await pool.query(`select * from auth where id = $1`, [id])
    if(verify.rows.length < 1){
        return res.status(401).json({message: "You have to create account first"})
    }else if(verify.rows[0].role !== "customer"){
        return res.status(401).json({message: "You are currently using our other service"})
    }
    
})
export default router