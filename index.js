const express = require("express")
const mongoose = require("mongoose")
const env = require("dotenv").config()

const authRouter = require("./Routes/auth")
const postRouter = require("./Routes/post");

const app = express()
const APPPORT = process.env.APP_PORT || 3000;
const DATABASE_CONNECTION_URI=`mongodb+srv://${process.env.APP_MONGODB_USERNAME}:${process.env.APP_MONGODB_PASSWORD}@cluster0.icvf0.mongodb.net/${process.env.APP_MONGODB_DATABASE}?retryWrites=true&w=majority`;


app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use("/auth", authRouter)
app.use("/post", postRouter);

app.use((error, req, res, next) => {
    if(error){
        // console.log(error);
        const statusCode = error.statusCode || 500
        const message = error.message
        const data = error.data || null
        res.status(statusCode).json({success: false,message: message, data: data})
    }
})

mongoose.connect(DATABASE_CONNECTION_URI).then(
    () => {
        console.log('Database connected!')
        app.listen(APPPORT, () => {
            console.log('App is running on http://localhost:' + APPPORT)
        })
    }
).catch(
    err => {    
        console.log(err)
    }
)

