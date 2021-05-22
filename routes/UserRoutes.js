const express = require('express');
const GoogleUser = require('./../models/UserModels/GoogleUser')
const User = require('./../models/UserModels/User')
const SMSUser = require('./../models/UserModels/SMSUser')
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const userTypes = require('./../Utils/UserTypes')
const smsUtil = require('./../Utils/SMS/sms')

router.post('/google/register',async (req,res) => {
    console.log("register",req.body)
    try{

        const Nuser = await User.findOne({email: req.body.email})
        if(Nuser !== null)
           return res.send({error: 'Already Registered'})

        const googleuser = await GoogleUser.findOne({email : req.body.email,type: req.body.type})

        if(googleuser){
            const token = await googleuser.generateAuthToken();
            return res.send({token})
        }

        let user = new GoogleUser();
        user.googleId = req.body.googleId;
        user.Name = req.body.name;
        user.email = req.body.email;
        user.image = req.body.image;

        if(req.body.type === userTypes.FARMER)
        {
            user.type = userTypes.FARMER
        }
    
        await user.save();
        const token = await user.generateAuthToken();
        res.send({token})
    }catch(e){
        console.log('/google/register - error',e)
        res.status(401).send({error: "Unable to register"})
    }

})

router.post('/google/login',async (req,res) => {
    console.log("login")
    try{

        const Nuser = await User.findOne({email: req.body.email})
        if(Nuser !== null)
           return res.send({error: 'Already Registered'})

        const googleuser = await GoogleUser.findOne({email : req.body.email,type: req.body.type})

        if(googleuser){
            const token = await googleuser.generateAuthToken();
            return res.send({token})
        }

        let user = new GoogleUser();
        user.googleId = req.body.googleId;
        user.Name = req.body.name;
        user.email = req.body.email;
        user.image = req.body.image;

        if(req.body.type === userTypes.FARMER)
        {
            user.type = userTypes.FARMER
        }
    
        await user.save();
        const token = await user.generateAuthToken();
        res.send({token})
    }catch(e){
        console.log('/google/login - error',e)
        res.send({error: "Unable to register"})
    }

})

router.post('/auth/register',async (req,res) => {
    console.log(req.body)
    try{
        const googleUser = await GoogleUser.findOne({email: req.body.email})
        console.log('gUser',googleUser)
        if(googleUser !== null)
           return res.send({error: 'Already Registered'})
        let user = _.pick(req.body,['email','name','phoneNo','password']);
        console.log("user",user);
        let newUser = new User(user);
        if(req.body.type === userTypes.FARMER)
        {
            newUser.type = userTypes.FARMER
        }
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.send({token});
    }catch(e){
        console.log("/auth/register - error",e)
        try{
            const email = await User.findOne({email:req.body.email},'email')
            if(email){
                return res.status(403).send({error:'email'})
            }

            const phoneNo = await User.findOne({phoneNo: req.body.phoneNo},'phoneNo')
            if(phoneNo){
                return res.status(403).send({error:"phoneNo"})
            }

            return res.status(403).send({error:"Invalid Credentials or Unexpected error has occured"})
        }catch(e){
            console.log("/auth/register - error",e);
            return res.status(403).send({error:"Unexpected error has occured"})
        }
    }

})

router.post('/auth/login',async (req,res) => {

    console.log("body",req.body);

    try{
        const user = await User.findOne({email: req.body.email,type: req.body.type});
        
        if(!user){
            return res.status(400).send();
        }

        const isMatch = await bcrypt.compare(req.body.password,user.password);

        if(isMatch){
            const token = await user.generateAuthToken();
            res.send({token});
        }else{
            res.status(400).send({login:false});
        }
    }catch(e){
        console.log("/auth/login - error",e);
        res.status(400).send({error: "Unexpected error has occured"})
    }

})

router.post('/SMS/register',async(req,res) => {

    console.log("/SMS/register",req.body.msg)

    // var msg = req.body.msg;
    // var index = msg.lastIndexOf(" ");
    // var name = msg.substring(0,index);
    // var mobile = msg.substring(index+1,msg.length)
    // var phoneno = /^\d{10}$/;

    // if(mobile.match(phoneno)) {
    //     let user = new SMSUser();
    //     user.Name = name;
    //     user.mobile = mobile;

    //     console.log()

    //     await user.save();

    //     res.send({added: true});
    // }else {
    //     console.log("mobile no. is not correct. Send message in proper format");
    //     res.send({error: "mobile no. is not correct. Send message in proper format"})
    // }

    let message = req.body.msg.split(" ")
    console.log(message.length)
    if(message.length < 2){
        return res.send({error: "Insufficient arguments"})
    }
    const mode = message.slice(0,1)[0].toLowerCase()
    console.log("mode",mode)
    const number = message.slice(1,2)[0]
    message = message.slice(1)

    if(mode === "register"){
      const response = await smsUtil.register(message)
      console.log("register response",response)
      res.send(response)
    }else{
       
        const user = await SMSUser.findOne({mobile:number})
        
        if(!user)
           return res.send({error: "Invalid Mobile Number. Please Register"})

        if(mode === "addcrop"){
           const response = await smsUtil.addCrop(message,user)
           console.log("addCrop response",response)
           res.send(response)
        }else if(mode === "updatecrop"){
            const response = await smsUtil.updateCrop(message,user)
            console.log("updateCrop response",response)
            res.send(response)
        }else if(mode === "deletecrop"){
            const response = await smsUtil.deleteCrop(message,user)
            console.log("delete crop",response)
            res.send(response)
        }else{
            res.send({error: "Incorrect arguments"})
        }
    }
})

// @desc Logout User
// @route /auth/logout

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect(`${process.env.REACT_URL}/login`)
})

module.exports = router;