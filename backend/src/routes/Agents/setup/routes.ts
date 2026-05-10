import { Router } from "express";
import { verifyToken } from "../../../utils/generateToken.js";
import { pool } from "../../../config/db.js";

const router = Router()
router.post("/apply", async (req, res)=>{
    const header  = req.headers
    const body = req.body
    if(!header) return res.status(400).json({message: "Bad Request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(400).json({message: "Bad Request"})
    const token = bearerToken.split(" ")[1]
    if(!token) return res.status(400).json({message: "Bad Request"})
    const id = verifyToken(token).id as string
    if(!id) return res.status(400).json({message: "Forbidden request"})
    const verify = await pool.query(`select * from auth where id = $1`, [id])
    if(verify.rows.length < 1){
        return res.status(401).json({message: "You have to create account first"})
    }else if(verify.rows[0].role !== "customer"){
        return res.status(401).json({message: "You are currently using our other service"})
    }else if(!verify.rows[0].email_verification){
        return res.status(401).json({message: "You have to verify your email first"})
    }else if(verify.rows[0].role === "customer"){
        const {idType, idNumber, idImageUrl, selfieImageUrl, driverLicenseNumber, 
            licenseExpiryDate, licenseImageUrl, vehicleType, vehicleModel, vehicleColor, PlateNumber, vehicleBrand, 
            vehicleImageUrl, address, city, state} = body
        if(!idType || !idNumber || !idImageUrl || !selfieImageUrl || !driverLicenseNumber || !licenseExpiryDate || !licenseImageUrl || !vehicleType || !vehicleModel || !vehicleColor || !PlateNumber || !vehicleBrand || !vehicleImageUrl || !address || !city || !state){
            return res.status(400).json({message: "All fields are required"})
        }else{
            const apply = await pool.query(`
                insert into delivery_agent_request (userid, id_type, id_number, id_image_url, selfie_image_url, driver_license_number, license_expiry_date, license_image_url, vehicle_type, vehicle_model, vehicle_color, plate_number, vehicle_brand, vehicle_image_url, address, city, state)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                returning *
                `, [id, idType, idNumber, idImageUrl, selfieImageUrl, driverLicenseNumber, licenseExpiryDate, licenseImageUrl, vehicleType, vehicleModel, vehicleColor, PlateNumber, vehicleBrand, vehicleImageUrl, address, city, state])
            if(apply.rows.length < 1) return res.status(500).json({message: "Server error, failed to apply"})
            return res.status(200).json({message: "Application submitted successfully"})
        }
    }
    
})
export default router