const express = require('express')
const csrf = require('csurf');
const helmet = require('helmet');
const product = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')
const payment = require('./routes/payment')
const error = require('./middleWares/error')
const cookieParser = require('cookie-parser')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors');

dotenv.config({path:path.join(__dirname,"config/configuration.env")})


app.use(cors());
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use(helmet());
app.use(cookieParser())

// Use csurf middleware to enable CSRF protection
app.use(csrf({ cookie: true }));

// Middleware to set CSRF token in a cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
app.use('/api/v1/',product)
app.use('/api/v1/',auth)
app.use('/api/v1/',order)
app.use('/api/v1/',payment)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/build")))
    app.get("*",(req,res)=>
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html")))
}

app.use(error)

module.exports=app