import multer from "multer";

const storage = multer.diskStorage({})
export const uploadSignup = multer({ 
    storage,
    limits: {
        fileSize: 1*1024*1024
    }
})