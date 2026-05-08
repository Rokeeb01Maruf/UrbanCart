import { Router } from "express";
import { pool } from "../../../config/db.js";
import { verifyadmin } from "../../../utils/verify.js";

const router = Router()

router.post("/unapproved", async(req, res)=>{
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    const getItems = await pool.query(`select * from products where status = 'pending'`)
    if(getItems.rows.length < 1) return res.status(404).json({message: "No products found"})
    return res.status(200).json(getItems.rows)
})

router.post("/get-all", async(req, res)=>{
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    const getItems = await pool.query(`select * from products`)
    if(getItems.rows.length < 1) return res.status(404).json({message: "No products found"})
    return res.status(200).json(getItems.rows)
})

router.patch("/alter/:id", async (req, res)=>{
    const pId = req.params.id as string
    const action = req.query.action
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    if(!pId) return res.status(400).json({message: "Invalid request"})
    if(action === "approve"){
        const approve = await pool.query(`
            update products set vendor_status = 'active', status = 'approved' where id = $1
            returning *
            `,[pId])
        if(approve.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product approved successfully"}, approve.rows[0]])
    }else if(action === "pause"){
        const pause = await pool.query(`
            update products set status = 'pending' where id = $1
            returning *
            `,[pId])
        if(pause.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product paused successfully"}, pause.rows[0]])
    }else if(action === "reject"){
        const reject = await pool.query(`
            update products set status = 'rejected' where id = $1
            returning *
            `,[pId])
        if(reject.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Product deleted successfully"}, reject.rows[0]])
    }else if(action === "verify"){
        const checkStatus = await pool.query(`select vendor_status from products where id = $1`, [pId])
        if(checkStatus.rows.length < 1) return res.status(404).json({message: "Product not found"})
        if(checkStatus.rows[0].vendor_status != "verify") return res.status(400).json({message: "Product has already been verified before"})
        const verify = await pool.query(`
            update products set status = 'verified', vendor_status = 'verified' where id = $1
            returning *
            `,[pId])
        if(verify.rows.length < 1) return res.status(500).json({message: "server error, failed to verify product"})
        return res.status(200).json([{message: "Product verified successfully"}, verify.rows[0]])
    }else{
        return res.status(403).json({message: "Unauthorized request"})
    }

})
export default router