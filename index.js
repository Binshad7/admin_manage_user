const express = require('express');
const app = express();
const dotenv = require('dotenv');
const ejs = require('ejs');
const logger = require('morgan');
const session = require('express-session');
const nocache = require('nocache');
const MongoStore = require('connect-mongo');
// const flash = require('connect-flash');
dotenv.config();

// require db 
const db = require('./config/db');
db();

// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // req.body available data
app.use(logger('common')); // for debugging HTTP requests
app.use(express.static('public')); // serve public assets

// session 
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// cache
app.use(nocache());

// view engine
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

// user router
const user_router = require('./router/user-router');
app.use('/', user_router);

// admin router
const admin_router = require('./router/admin_router');
app.use('/admin', admin_router);

// 404 handler
app.all('*', (req, res) => {
    res.status(404).send('404 - Not Found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (process.env.NODE_ENV === 'development') {
        res.status(500).send(err.stack);
    } else {
        res.status(500).send('Internal Server Error');
    }
});

// listen on port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
