const express = require('express');
const router = express.Router();
const User = require('./../models/UserModels/User')
const GoogleUser = require('./../models/UserModels/GoogleUser')
const Products = require('./../models/product')
const auth = require('./../middleware/auth');
const { BUYER, FARMER } = require('../Utils/UserTypes');

router.get('/profile',auth, async (req,res) => {
    const profile = await User.findOne({_id:req.user.id});
    const googleProfile = await GoogleUser.findOne({_id: req.user.id})
    let user;

    if(profile){
        user = profile
    }else{
        user = googleProfile
    }

    const profileAndProducts = {
        user,
        products: null
    }
    if(req.user.type == FARMER)
    {
        const products = await Products.find({farmerId:req.user.id});
        profileAndProducts.products = products
    }

    res.send(profileAndProducts)
    
})

router.post('/profile/update',auth,async(req,res) => {
    try{
        req.user.name = req.body.name
        req.user.phoneNo = req.body.phoneNo
        req.user.address = req.body.address
        req.user.pincode = req.body.pincode
        await req.user.save()
        res.send({added:true})
    }catch(e){
        console.log("/profile/update",e)
        res.send({added: false})
    }
    
})

router.get('/profile/:productId',auth, async(req,res)=> {
    if(req.user.type == BUYER){
        res.json({error:'you can not add product'})
    }
    else {
        const product = await Products.findOne({_id:req.params.productId});
        res.json(product);
    }
})

module.exports = router;