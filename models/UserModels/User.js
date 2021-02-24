const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserToken = require('./../UserToken')

let UserSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    phoneNo: {
        type: Number,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
}, { timestamps: true })

UserSchema.pre('save',async function(next){
  
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8);
    }

})

UserSchema.methods.generateAuthToken = async function(){
    const user = this
    console.log('secret',process.env.JWT_SECRET)
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:24*60*60*1000})
    let userToken = new UserToken();
    userToken.token = token;
    userToken.userId = user._id;
    console.log('token',token);

    await userToken.save();

    return token
}

module.exports = mongoose.model("User",UserSchema);