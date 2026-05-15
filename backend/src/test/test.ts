import Router from "express";
import { uploadSignup } from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = Router()

router.post("/test", async(req, res)=>{
    uploadSignup.single("image")(req, res, async(err)=>{
        if(err){
            if(err.code === "LIMIT_FILE_SIZE") return res.status(400).json({message: "Maximum file size exceeded"})
            return res.status(400).json({message: err.code})
        }
    })
    try{
        if(!req.file) return res.status(400).json([{message: "Bad Request"}, req.file])
        const result = await cloudinary.uploader.upload(req.file.path)
        return res.status(200).json([{message: "File uploaded successfully"}, result])
    }catch(err){
        return res.status(500).json([{message: "server error, failed to upload file"}, err])
    }
})

export default router