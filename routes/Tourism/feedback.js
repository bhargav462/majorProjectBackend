const express = require('express')
const router = express.Router()
const Feedback = require('./../../models/Feedback/feedback')

router.post('/form',async (req,res) => {
    console.log("Body",req.body)
    try{
        const {name,place} = req.body
        const feedback = new Feedback();
        feedback.name = name
        feedback.place = place
        feedback.feedback = req.body.feedback
        console.log("feedback",feedback)
        await feedback.save()
        res.send();
    }catch(e){
        res.send({error:e})
    }
})

router.get('/get',async (req,res) => {
    try{
       let feedback = await Feedback.find();
       res.send(feedback)
    }catch(e){
       res.send({error: e})
    }
})

module.exports = router