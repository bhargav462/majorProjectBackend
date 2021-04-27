const express = require('express');
const GoogleUser = require('./../models/UserModels/GoogleUser')
const User = require('./../models/UserModels/User')
const SMSUser = require('./../models/UserModels/SMSUser')
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');

router.post('/google/register',async (req,res) => {
    console.log("register")
    try{

        const googleuser = await GoogleUser.findOne({email : req.body.email})

        if(googleuser){
            const token = await googleuser.generateAuthToken();
            return res.send({token})
        }

        let user = new GoogleUser();
        user.googleId = req.body.googleId;
        user.Name = req.body.name;
        user.email = req.body.email;
        user.image = req.body.image;
    
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

        const googleuser = await GoogleUser.findOne({email : req.body.email})

        if(googleuser){
            const token = await googleuser.generateAuthToken();
            return res.send({token})
        }

        let user = new GoogleUser();
        user.googleId = req.body.googleId;
        user.Name = req.body.name;
        user.email = req.body.email;
        user.image = req.body.image;
    
        await user.save();
        const token = await user.generateAuthToken();
        res.send({token})
    }catch(e){
        console.log('/google/login - error',e)
        res.status(401).send({error: "Unable to register"})
    }

})

router.post('/auth/register',async (req,res) => {

    try{
        let user = _.pick(req.body,['email','name','phoneNo','password']);
        console.log("user",user);
        let newUser = new User(user);
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

            return res.status(403).send({error:"Unexpected error has occured"})
        }catch(e){
            console.log("/auth/register - error",e);
            return res.status(403).send({error:"Unexpected error has occured"})
        }
    }

})

router.post('/auth/login',async (req,res) => {

    try{
        const user = await User.findOne({email: req.body.email});
        
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

    console.log("/SMS/register",req.body)

    var msg = req.body.msg;
    var index = msg.lastIndexOf(" ");
    var name = msg.substring(0,index);
    var mobile = msg.substring(index+1,msg.length)
    var phoneno = /^\d{10}$/;

    if(mobile.match(phoneno)) {
        let user = new SMSUser();
        user.Name = name;
        user.mobile = mobile;

        console.log()

        await user.save();

        res.send({added: true});
    }else {
        console.log("mobile no. is not correct. Send message in proper format");
        res.send({error: "mobile no. is not correct. Send message in proper format"})
    }
    

})

// @desc Logout User
// @route /auth/logout

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect(`${process.env.REACT_URL}/login`)
})

module.exports = router;