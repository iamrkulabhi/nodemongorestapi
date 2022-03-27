const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const JWT_Private = process.env.APP_JWT_SECRET;


module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('Authorization Failed!');
        error.statusCode = 401;
        error.success = false;
        error.data = [];
        throw error;
    }

    const _token = authHeader.split(' ')[1];
    let decode;

    try{
        decode = jwt.verify(_token, JWT_Private);
    }catch(err){
        const error = new Error('Authorization Failed!');
        error.statusCode = 401;
        error.success = false;
        error.data = [];
        throw error;
    }

    if(!decode){
        const error = new Error('Authorization Failed!');
        error.statusCode = 401;
        error.success = false;
        error.data = [];
        throw error;
    }

    req.user = decode.user;
    next();
};