const adminModel = require('../models/userModel')


const login = (req, res) => {
    console.log("tt");
    
    res.render('admin/login',{})
}
const adminValidation = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const adminValid = await adminModel.findOne({
            email,
            password
        })

    } catch (err) {
        console.log(err);

    }
}
module.exports = {
    login,
    adminValidation
}