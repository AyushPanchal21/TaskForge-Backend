import "dotenv/config";
import app from "./app.js"

const PORT = process.env.PORTNUMBER || 1221;

app.listen(PORT,()=>{
    console.log(`server running on : ${PORT}`)
})