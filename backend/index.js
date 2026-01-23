require('dotenv').config()

const connectDB = require('./config/db')
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credential:true
}))
app.use(express.urlencoded())
app.use(express.json())


app.use('/api',blog)

app.listen(port,()=>{
    console.log("server running")
    connectDB()
})