const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const env = require("dotenv").config()

const UserModel = require("../Models/User")
const vh = require("./validation-handlers")

const salt = bcrypt.genSaltSync(+process.env.APP_PASSWORD_SALT)

const JWT_Private = process.env.APP_JWT_SECRET

const regiterHandler = (req, res, next) => {
    vh.handleValidation(req)
    const _username = req.body.username
    const _email = req.body.email
    const _phone = req.body.phone
    const _password = bcrypt.hashSync(req.body.password, salt)

    const _user = new UserModel({
        username: _username,
        email: _email,
        phone: _phone,
        password: _password
    })

    _user.save().then(user => {
        res.status(201).json({success: true, data: user})
    }).catch(err => {
        next(err)
    });
}
const loginHandler = (req, res, next) => {
    vh.handleValidation(req)
    const _email = req.body.email
    const _password = req.body.password

    UserModel.findOne({$or: [{username: _email}, {email: _email}]}).then(user => {
        //console.log(user)   
        if(!bcrypt.compareSync(_password, user.password)){
            const error = new Error('Authentication failed')
            error.statusCode = 401
            error.data = [{message: 'Password incorrect'}]
            throw next(error)
        }else{
            const _token = jwt.sign({user: user}, JWT_Private, {expiresIn: 60*60})
            res.status(200).json({success: true, data: {token: _token}})
        }
    }).catch(err => {
        next(err)
    })
}
const forgetPasswordHandler = (req, res, next) => {
    vh.handleValidation(req)
    const _email = req.body.email

    UserModel.findOne({email: _email}).then(user => {
        crypto.randomBytes(+process.env.APP_RESET_PASSWORD_LENGTH, (err, buffer) => {
            if(err){
                throw err
            }

            const resetPasswordToken = buffer.toString('hex')
            UserModel.findOne({email: _email}).then(user => {
                user.token = resetPasswordToken
                user.tokenExpire = Date.now() + (1000*60*60)
                return user.save()
            })
            .then(user => {
                res.status(201).json({success: true, data: {resetPasswordToken}})
            }).catch(err => next(err))
        })
    }).catch(err => next(err))
}
const resetPasswordHandler = (req, res, next) => {
    vh.handleValidation(req)
    const _email = req.body.email
    const _resetPasswordToken = req.body.resetPasswordToken
    const _newPassword = bcrypt.hashSync(req.body.password, salt)
    UserModel.findOne({$and: [{email: _email}, {token: _resetPasswordToken}, {tokenExpire: {$gte: Date.now()}}]}).then(user => {
        user.token = ""
        user.password = _newPassword
        user.tokenExpire = Date.now()
        return user.save()
    }).then(result => {
        res.status(201).json({success: true, data: result})
    }).catch(err => next(err))
}

module.exports = {
    register: regiterHandler,
    login: loginHandler,
    forgetPassword: forgetPasswordHandler,
    resetPassword: resetPasswordHandler
};
