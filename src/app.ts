import express from "express"
import cookieParser from "cookie-parser"
import userRouter from "./modules/users/user_routes.js"
import organizationRouter from "./modules/organization/organization_routes.js"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/users",userRouter)

app.use("/api/v1/organization",organizationRouter)


export default app;
