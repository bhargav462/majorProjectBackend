const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SMSUserSchema = new Schema({
    name: {
        type: String
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