const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const serverless = require('serverless-http')

const connectDB = require('../config/db');
dotenv.config({path:'./config/config.env'})

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(require('../routes/UserRoutes'))
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res) => {
    console.log('deployed successfully')
    res.send('<h1>You can get / route</h1>')
})

require('../models/product')
app.use('/products', require('../routes/product'))
app.use(require('../routes/news'))

//It is not a part of this project
app.use('/feedback',require('../routes/Tourism/feedback'))

app.use(require('../routes/profile'))

app.listen(PORT,() => {
    console.log(`Server running in ${process.env.NODE_ENV} made on port ${PORT}`);
})

module.exports.handler = serverless(app);













// let users = [];
// for(let i = 1; i <= 40; i = i + 1){
//    const user = {
//        id: i,
//        name: `user ${i}`
//    }
//    users.push({...user})
// }

// let posts = []
// for(let i = 1; i <= 40; i = i + 1){
//     const post = {
//         id: i,
//         name: `post ${i}`
//     }
//     posts.push({...post})
//  }

// app.get('/users',paginatedResults(users),(req,res) => {
//     res.json(res.paginatedResults)
// })

// app.get('/posts',paginatedResults(posts),(req,res) => {
//     res.json(res.paginatedResults)
// })

// function paginatedResults(model){
//     return (req,res,next) => {
//         const page = parseInt(req.query.page)
//         const limit = parseInt(req.query.limit)
        
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit

//         const results = {}

//         if(endIndex < model.length)
//         results.next = {
//             nextPage: page + 1,
//             limit
//         }

//         if(startIndex > 0)
//         results.previous = {
//             previousPage: page - 1,
//             limit
//         }
//         results.results = model.slice(startIndex,endIndex)
//         res.paginatedResults = results
//         next()
//     }
// }