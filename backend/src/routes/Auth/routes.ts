import Router from "express"

const router = Router()

router.post("/register", (req, res)=>{
    const {firstName, lastName, password} = req.body
    if(!firstName || !lastName || !password){
        return res.status(400).json({
            message: "All field are required"
        })
    }
    res.status(200).json({
        message: "Account created successfully"
    })
})


export default router