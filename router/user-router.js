const express = require('express');
const user_router = express();
const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()
// session


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname,'../public/userImages'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const uploaded = multer({storage:storage})


// auth checking
const auth = require('../middleware/userAuth');

// user controller
const userController = require('../controller/userController')

user_router.get('/',auth.is_login,userController.home)

user_router.get('/signup',auth.is_logout,userController.signup)

 // only 1 image uploaded if we want to more image form user uploaded.array('image',3) 3 means how many image we want also set in input field multiple
user_router.post('/registerUser',uploaded.single('image'),userController.newUserRegister)

user_router.get('/login',auth.is_logout,userController.login)

user_router.post('/loginValidation',userController.userValid)

user_router.get('/logout',userController.logout);

user_router.get('/mailVerify/:id',userController.mailVerification);

module.exports =user_router