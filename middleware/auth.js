const jwt = require('jsonwebtoken');
const User = require('../models/UserModels/GoogleUser');
const UserToken = require('../models/UserToken')

const LOGIN = "Login"

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
        console.log('user',user);
        if(!user){
            console.log('Login');
            return res.status(403).send({error:LOGIN});
        }

        console.log('authentication was done succesfully');

        req.user = user;
        req.token = token;
        next();
    }catch(err){
        console.log('error',err.name);
        res.status(401).send({error:LOGIN});
    }
}

module.exports = auth;