const express = require('express');
const admin_router = express();

const auth = require('../middleware/AuthAdmin')

const admin_controller = require('../controller/adminController')

admin_router.get('/login',admin_controller.login);
// admin_router.get('/',auth.is_login,admin_controller.login);

admin_router.post('/loginValid',admin_controller.adminValidation);
admin_router.get('/:adminID',admin_controller.adminHome);

module.exports = admin_router;