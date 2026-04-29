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

router.patch("/pause/:id", async (req, res)=>{
    const header = req.headers
    if(!header) res.status(400).json({message: "Bad request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad request"})
    const token = bearerToken.split(" ")[1] as string
    if(!token) res.status(400).json({message: "Bad request"})
    const id = verifyToken(token).id
    const productId = req.params.id as string
    if(!productId) return res.status(400).json({message: "Bad Request"})
        const vendor_id = await pool.query(`
        select id from vendor where userid = $1
        `, [id])
    if(vendor_id.rows.length < 1) return res.status(403).json({message: "Not  a vendor"})
    const pause = await pool.query(`
        update products set report_status = 'pending' where vendor_id = $1 and id = $2 returning *
        `, [vendor_id.rows[0].id, productId])
    return res.status(200).json([{message: "Paused successfully"}, pause.rows])
    
})

export default router