const express = require('express');
const app = express();
const dotenv = require('dotenv');
const ejs = require('ejs')
const logger = require('morgan')
const session = require('express-session')
const nocache = require('nocache')
// const flash = require('connect-flash')
dotenv.config()


// require db 
const db = require('./config/db')
db() 

// middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true})) // req.body available data   
app.use(logger('common'))//for debug the http request
app.use(express.static('public'))// public folder fetch css and js



//session 
app.use(session({
    secret:process.env.secret,
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*60*24}
  }))


// cache
app.use(nocache())
  
// view engine
app.set('view engine','ejs')

const PORT = process.env.PORT || 5000;

// user router
const  user_router = require('./router/user-router')
app.use('/',user_router)


// admin router
const admin_router = require('./router/admin_router');
app.use('/admin',admin_router)

// other Routers
app.all('*',(req,res)=>{
    res.send('404')
})

// listen this port 
app.listen(PORT,()=>{
    console.log(`PORT Running on ${PORT}`);
}) 