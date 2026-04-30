import { Router } from "express";
import { verifyToken } from "../../../utils/generateToken.js";
import { pool } from "../../../config/db.js";

const router = Router()

router.post("/list", async(req, res)=>{
    const header = req.headers
    if(!header) return res.status(400).json({message: "Bad Request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad Request"})
    const token = bearerToken.split(" ")[1]
    if(!token) return res.status(400).json({message: "Bad Request"})
    const id = verifyToken(token).id as string
    const verify = await pool.query(`
        select role from auth 
        `)
})

router.patch("/alter/:id", async (req, res)=>{
    const header = req.headers
    const pId = req.params.id as string
    if(!pId) return res.status(400).json({message: "Invalid request"})
    if(!header) return res.status(400).json({message: "Bad Request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad request"})
    const token = bearerToken.split(" ")[0] as string
    if(!token) return res.status(400).json({message: "Bad request"})
    const id = verifyToken(token).id as string
    const verify = await pool.query(`
        select role from auth where id = $1
        `, [id])
    if(verify.rows.length < 1) return res.status(403).json({message: "Unauthorized request"})
    if(verify.rows[0].id !== "admin") return res.status(403).json({message: "Unauthorized request"})
    const action = req.query.action
    if(action === "approve"){
        const approve = await pool.query(`
            update products set report_status = 'active', status = 'approved' where id = $1
            returning *
            `,[pId])
        if(approve.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product approved successfully"}, approve.rows[0]])
    }else if(action === "pause"){
        const pause = await pool.query(`
            update products set report_status = 'pending', status = 'pending' where id = $1
            returning *
            `,[pId])
        if(pause.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product paused successfully"}, pause.rows[0]])
    }else if(action === "reject"){
        const reject = await pool.query(`
            update products set report_status = 'delete', status = 'rejected' where id = $1
            returning *
            `,[pId])
        if(reject.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product deleted successfully"}, reject.rows[0]])
    }else{
        return res.status(403).json({message: "Unauthorized request"})
    }

})

export default router