import Router from "express";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = Router()

router.post("/test", upload.single("image"), async(req, res)=>{
    try{
        if(!req.file) return res.status(400).json({message: "Bad Request"})
        const result = await cloudinary.uploader.upload(req.file.path)
        return res.status(200).json([{mesage: "File uploaded successfully"}, result])
    }catch(err){
        return res.status(500).json([{message: "server error, failed to upload file"}, err])
    }
})

export default router