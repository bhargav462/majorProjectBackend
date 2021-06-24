// It doesn't belongs to this project
// It belongs to tourism project

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const FeedbackSchema = new Schema({
    name:{
        type: String
    },
    place:{
        type: String
    },
    feedback:{
        type:String
    },
    rating: {
        type: Number
    }
})

module.exports = mongoose.model('Feedback',FeedbackSchema)