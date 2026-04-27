import { Router } from "express";

const router = Router()

router.post("add-product", (req, res)=>{
    const header = req.headers
    if(!header) return res.status(403).json({message: "Forbidden request"})
    const bearerToken = header.authorization as string
    if(!bearerToken) return res.status(403).json({message: "Forbidden request"})
})