const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Products = mongoose.model("products");
const sharp = require('sharp');

const multer = require('multer');

const upload = multer();

app.get('/', async (req,res) => {
    const products = await Products.find();
    res.json(products);
})

app.post('/farmer/addCrop', upload.array('images'),async (req,res) => {
    
    console.log("body",req.body)
    console.log(req.files)

    req.on('data', (data) => {
        console.log("data",data);
    });

    let images = req.files.filter(images => {
        return images.buffer;
    })

    console.log("images",images)

    await new Products({
        crop: req.body.cropName,
        address: req.body.address,
        price: req.body.price,
        amount: req.body.weight,
        description: req.body.description,
        images : images
    }).save((err,data) => {
        if(err) {
            res.json(err)
        }
        else{
            res.send({added:true})
        }
    })
})

app.get('/update/:id/:crop/:location/:price/:amount/:description', async(req,res) => {
    await Products.updateOne({_id:req.params.id}, { 
        
        crop: req.params.crop,
        location: req.params.location,
        price: req.params.price,
        amount: req.params.amount,
        description: req.params.description

    }, (err,data)=> {
        if(err) {
            res.json(err)
        }
        else{
            res.redirect('/products')
        }
    })
})

app.get('/delete/:id', async (req,res) => {
    await Products.deleteOne({_id:req.params.id}, (err,_data) => {
        if(err){
            res.json(err)
        }
        else{
            res.redirect('/products')
        }
    })
})

module.exports = app;