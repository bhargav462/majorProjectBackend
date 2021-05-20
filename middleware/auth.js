const jwt = require('jsonwebtoken');
const GoogleUser = require('../models/UserModels/GoogleUser');
const User = require('./../models/UserModels/User')
const UserToken = require('../models/UserToken')

const LOGIN = "Please Login"

const auth = async(req,res,next) => {
    try{
        const token = req.headers.token;
        console.log('token',token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log('decoded',decoded);
        const userToken = await UserToken.findOne({token})
        console.log('userToken',userToken);
        if(!userToken){
            return res.status(403).send({error:LOGIN});
        }

        const user = await User.findOne({_id:decoded._id})
        const googleUser = await GoogleUser.findOne({_id:decoded._id})
        console.log('user',user);
        console.log('user bool',(!user))
        if((user !== null) && (googleUser !== null)){
            console.log('Login');
            return res.status(403).send({error:LOGIN});
        }

        if(user !== null){
            req.user = user;
        }else{
            req.user = googleUser;
        }
        req.token = token;
        console.log('authentication was done succesfully');
        
        next();
    }catch(err){
        console.log('error',err.name);
        res.status(401).send({error:LOGIN});
    }
}

module.exports = auth;