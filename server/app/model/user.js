const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name:{
        type: String, require
    },
    role: { type: String, enum: ['admin', 'client', 'coach'], default: 'client' },
     roleId:{ type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    email: {
        type: String,
        require
    }, password: { type: String, required: true }, phone: {
        type: String,
        require
    }, avatar: {
        type: String,
        require
    },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    status: {
        type: Boolean,

    },
    otp: {
        type: String,
        require: true
    },
    otpExpiry: {
        type: Date
    },
    isVerify: {
        type: Boolean,
        default: false
    }
})
const userModel = mongoose.model('user', userSchema)
module.exports = userModel