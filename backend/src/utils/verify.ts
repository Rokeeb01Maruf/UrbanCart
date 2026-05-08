import { pool } from "../config/db.js"
import { verifyToken } from "./generateToken.js"

export const verifyadmin = async (req: any) =>{
    const header = req.headers
    if(!header || !header.authorization) return {code: 400, error: "Bad Request"}
    const bearerToken = header.authorization
    const token = bearerToken.split(" ")[1]
    if(!token) return {code: 400, error: "Invalid bearer token format"}
    let id: string
    try{
        id = verifyToken(token).id as string
    }catch(err){
        return { code: 401, error: "Invalid token"}
    }
    
    const admin = await pool.query(`
        select role from auth where id = $1 and role = 'admin'
        `,[id])
    if(admin.rows.length < 1){
        return {code: 404, error: "User not found or unauthorized request"}
    }else{
        return {code: 200, message: admin.rows[0]}
    }
}

export const verifyVendor = async (req: any) =>{
    const header = req.headers
    if(!header || !header.authorization) return {code: 400, error: "Bad Request"}
    const bearerToken = header.authorization as string
    const token = bearerToken.split(" ")[1]
    if(!token) return {code: 400, error: "Bad Request"}
    let id;
    try{
        id = verifyToken(token).id as string
    } catch(err){
        return {code: 401, error: "Invalid token"}
    }
    const vendor = await pool.query(`
        select role from auth where id = $1 and role = 'vendor'
        `,[id])
    if(vendor.rows.length < 1){
        return {code: 404, error: "User not found or unauthorized request"}
    }else{
        const checkvendor = await pool.query(`
            select * from vendors where userid = $1
            `, [id])
        if(checkvendor.rows.length < 1){
            return {code: 404, error: "Vendor not found"}
        }else{
            return {code: 200, message: checkvendor.rows[0]}
        }
    }
}