const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    crop: {
        type: String
    },
    location: {
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
    }
});

module.exports = mongoose.model('products', productSchema);
