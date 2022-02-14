const mongoose = require('mongoose')
const ObjectID = mongoose.ObjectID

const productSchema = new mongoose.Schema({
    farmerId:{
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:[{
        type: String    
    }],
    number:{
        type: Number
    }
});

module.exports = mongoose.model('products', productSchema);
