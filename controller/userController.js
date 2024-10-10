const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const ObjectID = require('mongoose').Types.ObjectId
const Mail = require('../config/mailVeriFication')


const home = async (req, res) => {

    let _id = new ObjectID(req.session.userID)

    const user = await userModel.findOne({
        _id: _id
    })
    console.log(user);
    
   const {name,image} = user;

    res.render('users/home', {
        name,
        image,
    })
}

const signup = (req, res) => {
    res.render('users/signup')
}


const newUserRegister = async (req, res) => {


    if (!req.file) {
        return res.status(400).json({
            status: 400,
            error: 'file is must'
        })
    }
    try {
        let { name, email, password } = req.body;
        password = password[0]
        const image = req.file.filename

        // const exist = await  userValidCheck(email)
        const exist = await userModel.findOne({
            email
        });
        if (!exist) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new userModel({
                name,
                email,
                image,
                password: hashedPassword,
                is_admin: false
            })
            let result = await user.save()
            
            req.session.user = true;
            req.session.userID = result._id;

            Mail.sendVeriFyMail(result.name, result.email, result._id)
            return res.status(200).json({

                status: 200,
                result: 'Data Submit successfully'
            })
        }
        res.status(301).json({
            status: 301,
            error: 'User Already Exist'
        })
    } catch (err) {
        console.log(err);
    }
}

const login = (req, res) => {
    let error = req.session.error
    req.session.error = null

    res.render('users/login', {
        error
    })
}
const userValid = async (req, res) => {

    try {


        const {
            email,
            password
        } = req.body
        const user = await userModel.findOne({
            email
        })

        if (user) {
            let valid = bcrypt.compareSync(password, user.password);
            if (valid) {

                req.session.userID = user._id;
                req.session.user = true;
                return res.redirect('/')

            } else {
                req.session.error = 'Password Does Not Match'

                res.redirect('/login')
            }
        } else {
            req.session.error = 'Email Does Not Match'
            res.redirect('/login')
        }
    } catch (error) {
        console.error(error)
    }
}


const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login')
}

const mailVerification = async (req, res) => {
    const update = await userModel.updateOne({ _id: req.params.id }, { $set: { is_verified: 1 } })
    res.render('users/emailVerified')

}
module.exports = {
    home,
    login,
    signup,
    newUserRegister,
    userValid,
    logout,
    mailVerification
}