import Router from "express";
import { verifyToken } from "../../utils/generateToken.js";

const router = Router()
router.post("/vendors-request", (req, res)=>{
    const header = req.headers
    if(!header){
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
})


export default router
