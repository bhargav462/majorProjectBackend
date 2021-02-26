const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Products = mongoose.model("products");

app.get('/', async (req,res) => {
    const products = await Products.find();
    res.json(products);
})

app.get('/insert/:crop/:location/:price', async (req,res) => {
    await new Products({
        crop: req.params.crop,
        location: req.params.location,
        price: req.params.price
    }).save((err,data) => {
        if(err) {
            res.json(err)
        }
        else{
            res.redirect('/products')
        }
    })
})

app.get('/delete/:id', async (req,res) => {
    await Products.deleteOne({_id:req.params.id}, (err,data) => {
        if(err){
            res.json(err)
        }
        else{
            res.redirect('/products')
        }
    })
})

module.exports = app;