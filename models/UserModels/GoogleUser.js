const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')
const UserToken = require('../UserToken')
const loginType = require('./../../config/loginTypes')
const userTypes = require('./../../Utils/UserTypes')

const GoogleUserSchema = new Schema({
    type:{
        type: String,
        default: userTypes.BUYER
    },
    googleId: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type:String,
        unique: true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    image: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

GoogleUserSchema.methods.generateAuthToken = async function(){
    const user = this
    console.log('secret',process.env.JWT_SECRET)
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:24*60*60*1000})

    const userToken = new UserToken();
    userToken.token = token
    userToken.userId = user._id;
    userToken.loginType = loginType.GOOGLE;
    await userToken.save();

    return token
}

module.exports = mongoose.model('GoogleUser',GoogleUserSchema);