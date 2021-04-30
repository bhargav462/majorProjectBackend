const express = require('express');
const router = express.Router();
const User = require('./../models/UserModels/User')
const Products = require('./../models/product')
const auth = require('./../middleware/auth');
const { BUYER, FARMER } = require('../Utils/UserTypes');

router.get('/profile',auth, async (req,res) => {
    const profile = await User.findOne({_id:req.user.id});
    res.json(profile);
    if(req.user.type == FARMER)
    {
        const products = await Products.find({farmerId:req.user.id}).toArray();
        res.json(products);
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