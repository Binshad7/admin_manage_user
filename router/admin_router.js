const express = require('express');
const admin_router = express();
const multer = require('multer')
const path = require('path')
  // Set up storage for uploaded files
  // suggest this we can do this in module
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


const auth = require('../middleware/AuthAdmin')
const admin_controller = require('../controller/adminController')


// home page render 
admin_router.get('/',auth.is_login,admin_controller.adminHome);
// login page render
admin_router.get('/login',admin_controller.login);
//logout page render
admin_router.get('/logout',auth.is_logout,admin_controller.logout)
// edit user page rendering
admin_router.get('/edituser/:userID',auth.is_login,admin_controller.editUser)


//admin validation
admin_router.post('/loginValid',admin_controller.adminValidation);
// user update
admin_router.post('/editUserProfile',uploaded.single('image'),admin_controller.updateProfile);

module.exports = admin_router;