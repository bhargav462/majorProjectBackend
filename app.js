const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

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
app.use(require('./routes/UserRoutes'))

app.get('/',(req,res) => {
    console.log('deployed successfully')
    res.send('<h1>You can get / route</h1>')
})

require('./models/product')
app.use('/products', require('./routes/product'))
app.use(require('./routes/news'))

//It is not a part of this project
app.use('/feedback',require('./routes/Tourism/feedback'))

app.use(require('./routes/profile'))

app.listen(PORT,() => {
    console.log(`Server running in ${process.env.NODE_ENV} made on port ${PORT}`);
})