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
    }
});

module.exports = mongoose.model('products', productSchema);
