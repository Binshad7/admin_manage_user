const express = require('express');
const admin_router = express();

const admin_controller = require('../controller/adminController')

admin_router.get('/admin/login',admin_controller.login);
admin_router.post('/admin/loginValid',admin_controller.adminValidation);

module.exports = admin_router;