const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SMSUserSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    mobile: {
        type:String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('SMSUser',SMSUserSchema);