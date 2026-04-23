import express from "express"
import cors from "cors"
import authRouter from "./routes/Auth/routes.js"
import vendorsRouter from "./routes/vendors/routes.js"
import verifyVendors from "./routes/Admin/routes.js"

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use("/auth",authRouter)
app.use("/vendor", vendorsRouter)
app.use("/admin", verifyVendors)

app.get('/', (req, res)=>{
    res.status(200).send("Server is running")
})

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})