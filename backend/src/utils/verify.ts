import { pool } from "../config/db.js"
import { verifyToken } from "./generateToken.js"

export const verifyadmin = async (header: {authorization: string}) =>{
    if(!header) return {code: 400}
    const bearerToken = header.authorization
    if(!bearerToken) return {code: 400}
    const token = bearerToken.split(" ")[1]
    if(!token) return {code: 400}
    const id = verifyToken(token).id as string
    if(!id) return {code: 401}
    const admin = await pool.query(`
        select role from auth where id = $1
        `,[id])
    if(admin.rows.length < 1){
        return {code: 403}
    }else if(admin.rows[0].role != 'admin'){
        return {code: 403}
    }else{
        return {code: 200, message: admin.rows[0]}
    }
}

export const verifyVendor = async (header: {authorization: string}) =>{
    if(!header) return {code: 400}
    const bearerToken = header.authorization
    if(!bearerToken) return {code: 400}
    const token = bearerToken.split(" ")[1]
    if(!token) return {code: 400}
    const id = verifyToken(token).id as string
    if(!id) return {code: 401}
    const vendor = await pool.query(`
        select role where id = $1
        `,[id])
    if(vendor.rows.length < 1){
        return {code: 401}
    }else if(vendor.rows[0].role != 'vendor'){
        return {code: 403}
    }else{
        const checkvendor = await pool.query(`
            select * from vendors where userid = $1
            `, [id])
        if(checkvendor.rows.length < 1){
            return {code: 404}
        }else{
            return {code: 200, message: checkvendor.rows[0]}
        }
    }
}