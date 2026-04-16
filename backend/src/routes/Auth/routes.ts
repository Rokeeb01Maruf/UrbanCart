import Router from "express"

const router = Router()

router.post("/signup", (req, res)=>{
    const {firstName, lastName, email, password, role, phone, profileUrl, address} = req.body
    if(!firstName || !lastName || !password || !role || !phone || !profileUrl || !address){
        return res.status(400).json({
            message: "All field are required"
        })
    }
    res.status(200).json({
        message: "Account created successfully"
    })
})


export default router