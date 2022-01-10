const router = require("express").Router()
const {body} = require("express-validator")
const bcrypt = require("bcryptjs")
const env = require("dotenv").config()

const authCtrl = require("../Controllers/auth")
const UserModel = require("../Models/User")

const salt = bcrypt.genSaltSync(+process.env.APP_PASSWORD_SALT)

router.post("/register", [
    body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom((value, {req}) => {
        if(value){
            return UserModel.findOne({username: value}).then(user => {
                if(user){
                    return Promise.reject("Duplicate username found")
                }
            })
        }
    }),
    body("email")
    .isEmail()
    .withMessage("Not a valid email")
    .custom((value, {req}) => {
        if(value) {
            return UserModel.findOne({email: value}).then(user => {
                if(user){
                    return Promise.reject("Duplicate email found")
                }
            })
        }
    }),
    body("phone")
    .notEmpty()
    .withMessage("Phone is required field")
    .custom((value, {req}) => {
        if(value){
            return UserModel.findOne({phone: value}).then(user => {
                if(user){
                    return Promise.reject("Duplicate phone number found")
                }
            })
        }
    }),
    body("password")
    .isLength({min: 6})
    .withMessage("Password length should be atleast 6 charecters")
], authCtrl.register)
router.post("/login", [
    body("email")
    .notEmpty()
    .withMessage("Email or user name required")
    .custom((value, {req}) => {
        if(value){
            return UserModel.findOne({$or: [{username: value}, {email: value}]}).then(user => {
                if(!user){
                    return Promise.reject("No account found for this username or email")
                }
            })
        }
    }),
    body("password")
    .isLength({min: 6})
    .withMessage("Password length should be atleast 6 charecters")
], authCtrl.login)

router.post("/forget-password", [
    body("email")
    .isEmail()
    .withMessage("Not a valid email")
    .custom((value, {req}) => {
        if(value) {
            return UserModel.findOne({email: value}).then(user => {
                if(!user){
                    return Promise.reject("Email not found")
                }
            })
        }
    })
], authCtrl.forgetPassword)

router.post("/reset-password", [
    body("email")
    .isEmail()
    .withMessage("Not a valid email")
    .custom((value, {req}) => {
        if(value) {
            return UserModel.findOne({email: value}).then(user => {
                if(!user){
                    return Promise.reject("Email not found")
                }
            })
        }
    }),
    body("resetPasswordToken")
    .notEmpty()
    .withMessage("Reset password token not found")
    .custom((value, {req}) => {
        if(value) {
            return UserModel.findOne({$and: [{email: req.body.email}, {token: value}, {tokenExpire: {$gte: Date.now()}}]}).then(user => {
                if(!user){
                    return Promise.reject("Invalid request for reset password")
                }
            })
        }
    }),
    body("password")
    .isLength({min: 6})
    .withMessage("Password length should be atleast 6 charecters")
], authCtrl.resetPassword)

module.exports = router

