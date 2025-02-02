const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000

require("dotenv").config()
app.use(cors({
    origin:"*",
    credentials:true,
    optionsSuccessStatus: 200,
}))
app.use(express.json())
app.use('/auth', require("./routes/authorization"))
app.use('/test', require("./routes/test"))
mongoose.connect(process.env.MONGO_URI+"test")
.then(()=> console.log("db connected successfully"))
.catch(error=>console.log(error))

app.get('/', (req,res)=>{
    res.send('Server working')
})
app.listen(PORT, (req,res)=>{
    console.log("server has been started on port 5000")
    console.log("http://localhost:5000")
})