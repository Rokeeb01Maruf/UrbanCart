import express from "express"
import cors from "cors"
import authRouter from "./routes/Auth/routes.js"
import vendorsRouter from "./routes/vendors/authorization/routes.js"
import verifyVendors from "./routes/Admin/vendors/routes.js"
import products from "./routes/vendors/products/routes.js"
import productAlter from "./routes/Admin/products/routes.js"

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use("/auth",authRouter)
app.use("/vendor/auth", vendorsRouter)
app.use("/admin/vendors", verifyVendors)
app.use("/vendor/products", products)
app.use("/admin/products", productAlter)

app.get('/', (req, res)=>{
    res.status(200).send("Server is running")
})

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})