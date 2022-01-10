const Schema = require("mongoose").Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    tokenExpire: {
        type: Date
    }
}, {timestamps: true});

const userModel = require("mongoose").model('User', userSchema)

module.exports = userModel

