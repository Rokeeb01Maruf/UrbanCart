import Router from "express";
import { pool } from "../../../config/db.js";
import { verifyadmin } from "../../../utils/verify.js";

const router = Router()

router.post("/request", async (req, res)=>{
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
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

router.patch("/action/:id", async (req, res)=>{
    const action = req.query.action as string
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    const vId = req.params.id as string
    if(!vId) return res.status(403).json({message: "Forbidden request"})
    const vendoreValidity = await pool.query(`select * from vendors_request where id = $1`, [vId])
    if(vendoreValidity.rows.length < 1){
        return res.status(404).json({message: "Vendor not found"})
    }else if(vendoreValidity.rows[0].verification_status === "verified"){
        const checkRegistry = await pool.query(`
            select * from vendors where userid = $1
             `, [vendoreValidity.rows[0].userid])
        if(checkRegistry.rows.length < 1){
            const registerBusiness = await pool.query(`
                insert into vendors (userid, name, profile_url, address, details, verification_status)
                values ($1, $2, $3, $4, $5, $6) returning *
                `, [vendoreValidity.rows[0].userid, vendoreValidity.rows[0].name, vendoreValidity.rows[0].profile_url, 
            vendoreValidity.rows[0].address, vendoreValidity.rows[0].details, vendoreValidity.rows[0].verification_status])
            if(registerBusiness.rows.length < 1) return res.status(500).json({message: "Server error, failed to register vendor"})
                return res.status(200).json([{message: `${registerBusiness.rows[0].name} has been approved`},
                registerBusiness.rows[0]])
        }
        return res.status(400).json({message: "Vendor is already verified and registered"})
    }else if(vendoreValidity.rows[0].verification_status === "pending"){
        if(action === "approve"){
            const approve = await pool.query(`
            update vendors_request set verification_status = 'verified' where id = $1
            returning *
            `, [vId])
            if(approve.rows.length < 1) return res.status(500).json({message: "Server error, failed to approve vendor"})
            const validateVendor = await pool.query(`
            update auth set role = 'vendor' where id = $1
            returning *
            `, [approve.rows[0].userid])
            if(validateVendor.rows.length < 1) return res.status(500).json({message: 'server error, failed to register vendor'})
            const registerBusiness = await pool.query(`
                insert into vendors (userid, name, profile_url, address, details, verification_status)
                values ($1, $2, $3, $4, $5, $6) returning *
                `, [approve.rows[0].userid, approve.rows[0].name, approve.rows[0].profile_url, 
            approve.rows[0].address, approve.rows[0].details, approve.rows[0].verification_status])
            if(registerBusiness.rows.length < 1) return res.status(500).json({message: "Server error, failed to register vendor"})
                return res.status(200).json([{message: `${registerBusiness.rows[0].name} has been approved`},
                registerBusiness.rows[0]])
        }else if(action === "reject"){
            const reject = await pool.query(`
                update vendors_request set verification_status = 'rejected' where id = $1
                returning *
             `, [vId])
             if(reject.rows.length < 1) return res.status(500).json({message: "Server error, failed to reject vendor"})
             return res.status(200).json({message: `${reject.rows[0].name} has been rejected`})
        }
    }else if(vendoreValidity.rows[0].verification_status === "rejected"){
        return res.status(400).json({message: "Vendor application has been rejected"})
    }else{
        return res.status(403).json({message: "Forbidden request"})
    }
})

router.post("/vendors", async (req, res)=>{
    const verify = await verifyadmin(req)
    if(verify.code != 200) return res.status(verify.code).json({error: verify.error})
    const getVendors = await pool.query(`select * from vendor`)
    if (getVendors.rows.length === 0) return res.status(404).json({message: "No vendors found"})
    return res.status(200).json([{message: "vendor's list fetched successfully"}, getVendors.rows])
})
export default router