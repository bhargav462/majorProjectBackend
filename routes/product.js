const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Products = mongoose.model("products");
const User = require('./../models/UserModels/User')
const GoogleUser = require('./../models/UserModels/GoogleUser')
const sharp = require('sharp');
const auth = require('./../middleware/auth')

const multer = require('multer');
const { FARMER, BUYER } = require('../Utils/UserTypes');
const product = require('../models/product');
const fs = require('fs');
const SMSUser = require('../models/UserModels/SMSUser');

const upload = multer();

app.post('/crops', async (req,res) => {
    const products = await Products.find();
    console.log('all crops',products)
    res.json(products);
})

app.get('/:cropName',auth,async(req,res) => {
    const products = await Products.find({crop:req.params.cropName});
    res.json(products);
})

app.post('/getCrop/id',async (req,res) => {
    console.log(req.body)
    try{
        const product = await Products.findById(req.body.id)
        if(product)
        res.send(product)
        else
        res.send({error:"Invalid Crop ID"})
    }catch(e){
        console.log("/getCrop/id ",e);
        res.send({error:"Invalid Crop ID"})
    }
})

app.post('/id',async(req,res) => {
    console.log(req.body)
    const product = await Products.findById(req.body.id);
    let farmer;
    if(product)
    {
        const user = await User.findById(product.farmerId)
        if(user){
           farmer = user
        }else{
            const googleUser = await GoogleUser.findById(product.farmerId)
            if(googleUser)
            farmer = googleUser
            else{
                const smsUser = await SMSUser.findById(product.farmerId)
                farmer = smsUser
            }
        }
    }
    console.log("farner",farmer)
    res.send({
        crop:product,
        farmer
    }); 
})

app.post('/farmer/addCrop',auth, upload.array('images'),async (req,res) => {

    if(req.user.type != FARMER)
    {
        return res.json({error: 'Only farmer can add a crop'})
    }
    else {

    console.log("body",req.body)
    console.log("user",req.user)
    console.log(req.files)

    let images = req.files.filter(images => {
        return images.buffer;
    })

    // console.log("width",images.width)

    console.log("images",images)

    if(images.length === 0)
    return res.send({error:"images are required"})

    await new Products({
        farmerId: req.user.id,
        crop: req.body.cropName,
        address: req.body.address,
        price: req.body.price,
        amount: req.body.weight,
        description: req.body.description,
        pincode: req.body.pincode,
        images : images
    }).save((err,data) => {
        if(err) {
            console.log("err -- /products/addCrop",err)
            res.send({error:err})
        }
        else{   
            res.send({id:data._id})
        }
    })

}
})

app.post('/farmer/updateCrop',auth,async(req,res) => {

    console.log('update Crop',req.body)

    try{
        const product = await Products.findOne({_id: req.body.id,farmerId:req.user._id})
       
        if(!product){
            return res.send({error: "You are not the owner of this crop"})
        }

        product.crop = req.body.crop
        product.location = req.body.address
        product.price = req.body.price
        product.amount = req.body.amount
        product.description = req.body.description
        product.pincode = req.body.pincode

        await product.save()
        res.send({added: true})
    }catch(e){
        console.log("error",e)
        res.send({error:e})
    }

})

app.post('/farmer/deleteCrop',auth, async (req,res) => {
    try{
        const product = await Products.deleteOne({_id: req.body.id,farmerId:req.user._id})
        console.log("product",product)
        if(product.deletedCount === 0){
            res.send({error: "You are not the owner of this crop"})
        }else{
            res.send({deleted:true})
        }
    }catch(e){
        console.log(e)
        res.send({error:e})
    }
})

app.post('/filter',async (req,res) => {
    const {filter} = req.body
    try{
        if(filter.crop && filter.pincode){
            console.log("crop and pincode")
            const products = await Products.find({crop: filter.crop, pincode: filter.pincode})
            res.send(products)
        }else if(filter.crop){
            console.log("crop")
            const products = await Products.find({crop: filter.crop})
            res.send(products)
        }else if(filter.pincode){
            console.log("pincode")
            const products = await Products.find({pincode: filter.pincode})
            res.send(products)
        }else{
            res.send({})
        }
    }catch(e){
        res.send({error: e})
    }

})  

module.exports = app;