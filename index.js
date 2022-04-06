const express = require("express")
const mongoose = require("mongoose")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require("dotenv").config()

const authRouter = require("./Routes/auth")
const postRouter = require("./Routes/post");
const attachmentRouter = require("./Routes/attachment")

const app = express()
const APPPORT = process.env.APP_PORT || 3000;
const DATABASE_CONNECTION_URI=`mongodb+srv://${process.env.APP_MONGODB_USERNAME}:${process.env.APP_MONGODB_PASSWORD}@cluster0.icvf0.mongodb.net/${process.env.APP_MONGODB_DATABASE}?retryWrites=true&w=majority`;


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const date = new Date();
        const dir = `uploads/${date.getFullYear()}/${date.getMonth() < 9 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)}/`;
        const absPath = path.resolve(__dirname, dir);
        const exists = fs.existsSync(absPath);

        if (!exists) {
            fs.mkdirSync(absPath, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/[:.]/g, '') + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|odt|ods|txt|xls|xlsx|mp4|/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb(`Error: ${extname} is unsupported file!`);
    }
};
const upload = multer({ 
    storage: fileStorage, 
    fileFilter: fileFilter, 
    limits : {
        fileSize : 100000000 // max 100 MB size
    } 
});


app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
});

app.use(upload.array('attachments', 50));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRouter)
app.use("/post", postRouter);
app.use("/attachment", attachmentRouter);

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

