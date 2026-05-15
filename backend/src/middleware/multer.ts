import multer from "multer";

const storage = multer.diskStorage({})
export const uploadProfile = multer({ 
    storage,
    limits: {
        fileSize: 3*1024*1024
    }
})