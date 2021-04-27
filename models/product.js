const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
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
    images:[Buffer]
});

module.exports = mongoose.model('products', productSchema);
