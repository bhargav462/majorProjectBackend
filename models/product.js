const mongoose = require('mongoose')
const ObjectID = mongoose.ObjectID

const productSchema = new mongoose.Schema({
    farmerId:{
        type: ObjectID
    },
    crop: {
        type: String
    },
    address: {
        type: String
    },
    price: {
        type: Number
    },
    amount: {
        type: Number
    },
    description: {
        type: String
    },
    images:[{
        type: Object
    }]
});

module.exports = mongoose.model('products', productSchema);
