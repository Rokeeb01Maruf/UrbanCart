import { Router } from "express";
import { verifyToken } from "../../../utils/generateToken.js";
import { pool } from "../../../config/db.js";

const router = Router()

router.post("/add-product", async (req, res)=>{
    const body = req.body
    const header = req.headers
    if(!header) return res.status(400).json({message: "Bad request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(403).json({message: "Bad request"})
    const token = bearerToken.split(" ")[1]
    if(!token) return res.status(400).json({message: "Bad Request"})
    const id = verifyToken(token).id
    if(!id) return res.status(401).json({message: "Bad request"})
    const verify = await pool.query(`
    select * from vendor where userid = $1
        `, [id])
    if(verify.rows.length < 1) return res.status(401).json({message: "unauthorized vendor"})
    if(verify.rows[0].verification_status != 'verified') return res.status(403).json({message: "unverified vendor"})
    if(!body) return res.status(400).json({message: "No product found"})
    const request = await pool.query(`
        insert into products(vendor_id, name, details, price, category, units_available, image_url, status, report_status)
        values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *
        `,[verify.rows[0].id, body.name, body.details, body.price, body.category,body.units, body.url, "pending", "active"])

    if(request.rows.length < 1) return res.status(500).json({message: "server error"})
    return res.status(200).json({message: "Product requested successfully"})
})

router.post("/my-products", async (req, res)=>{
    const header = req.headers
    if(!header) res.status(400).json({message: "Bad request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad request"})
    const token = bearerToken.split(" ")[1] as string
    if(!token) res.status(400).json({message: "Bad request"})
    const id = verifyToken(token).id
    const verify = await pool.query(`
        select id from vendor where userid = $1
        `, [id])
    if(verify.rows.length < 1) return res.status(400).json({message: "Not a vendor yet"})
    const products = await pool.query(`
        select * from products where vendor_id = $1
        `, [verify.rows[0].id])
    if(products.rows.length < 1) return res.status(200).json({message: "empty"})
    return res.status(200).json([{message: "Product listed successfully"}, products.rows])
})

router.patch("/alter/:id", async (req, res)=>{
    const header = req.headers
    const action = req.query.action as string
    if(!header) res.status(400).json({message: "Bad request"})
        const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad request"})
        const token = bearerToken.split(" ")[1] as string
    if(!token) res.status(400).json({message: "Bad request"})
    if(!action) res.status(400).json({message: "Bad request"})
    const id = verifyToken(token).id
    const productId = req.params.id as string
    if(!productId) return res.status(400).json({message: "Bad Request"})
        const vendor_id = await pool.query(`
        select id from vendor where userid = $1
        `, [id])
    if(vendor_id.rows.length < 1) return res.status(403).json({message: "Not  a vendor"})
    if(action === "activate"){
        const activate = await pool.query(`
            update products set report_status = 'activate', status = 'pending' where id = $1 and vendor_id = $2
            returning *
            `, [productId, vendor_id.rows[0].id])
        if(activate.rows.length < 1) return res.status(500).json({message: "sever error"})
        return res.status(200).json([{message: "Activation request sent successfully"}, activate.rows[0]])
    }else if(action === "nullify"){
        const nullify = await pool.query(`
            update products set report_status = 'nullify', status = 'pending' where id = $1 and vendor_id = $2
            returning *
            `, [productId, vendor_id.rows[0].id])
        if(nullify.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "Delete request sent successfully"}, nullify.rows[0]])
    }else if(action === "pause"){
        const pause = await pool.query(`
            update products set report_status = 'pending', status = 'pending' where id = $1 and vendor_id = $2
            returning *
            `,[productId, vendor_id.rows[0].id])
        if(pause.rows.length < 1) return res.status(500).json({message: "server error"})
        return res.status(200).json([{message: "pause request sent"}, pause.rows[0]])
    }else{
        return res.status(400).json({message: "invalid request"})
    }
    
})

export default router