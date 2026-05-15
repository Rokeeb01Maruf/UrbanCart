import { uploadProfile } from "../middleware/multer.js"
import cloudinary from "../config/cloudinary.js"

export default function upload(req:any, res:any, result:Function){
    uploadProfile.single("image")(req, res, async(err)=>{
        if(err){
            if(err.code === "LIMIT_UNEXPECTED_FILE") return result({message: "File size limit exceeded", code : 400, error: err})
            return result({message: "failed to parse the file", code: err.code, error: err})
        }else if(!req.file){
            return result({message: "No file found", code: 400})
        }
        try{
            const upload = await cloudinary.uploader.upload(req.file.path)
            return result({message: "File uploaded successfully", code: 200, file: upload.secure_url})
        }catch(err){
            return result({message: "server error", code: 500, error: err})
        }
    })
}