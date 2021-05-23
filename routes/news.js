const express = require('express')
const router = express.Router();
const fs = require('fs')

router.post('/crop/news',(req,res) => {
    fs.readFile('./Utils/news.json',(err,data) => {
        if(err){
            console.log("error",err)
            res.send({error: err})
        }
        data = JSON.parse(data)
        data = data.slice(1,100)
        res.send(data)
    })
})

router.post('/news/filter',(req,res) => {
    console.log("/news/filter",req.body)
    fs.readFile('./Utils/news.json',(err,data) => {
        if(err){
            console.log("error",err)
            res.send({error: err})
        }
        data = JSON.parse(data)
        
        for(let prop in req.body.crop){
            console.log("prop",prop)
            data = data.filter(crop => {
                return crop[prop].toLowerCase() === req.body.crop[prop].toLowerCase() 
            })
        }

        // data = data.filter(temp => {
        //     if(temp.)
        // })

        res.send(data)
    })
})

module.exports = router