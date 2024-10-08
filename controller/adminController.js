
const Model = require('../models/userModel')
const bcrypt = require('bcrypt')

const login = (req,res) => {
    console.log("admin log");
    res.render('admin/login')
}

const adminValidation = async (req,res)=>{
    console.log(req.body);
    // console.log(req);
    
    const {email, password} = req.body

    try{
    const userValid = await Model.findOne({email});
     if(userValid){
        let comparePass =  bcrypt.compareSync(password,userValid.password)
        if(comparePass ){
            if(userValid.is_admin === true){
                req.session.admin = true;
               return  res.status(200).json({status:200,msg:'Login Completed',userID:userValid._id}) 
            }
              res.status(401).json({status:400,error:'Admin Not Valid'})
        }else{
    
          res.status(401).json({status:409,error:'User Password in Not match'});
        }
     }else{
        res.status(401).json({status:400,error:'Mail Not Valid'})
     }
    }catch(error){
        res.status(500).json({error:'Some thing happen the server try after'})
    }
}
          
const adminHome =async (req,res)=>{
    try{
     let admin = await Model.findOne({_id:req.params.adminID}); 
     admin = admin[0]
     console.log(admin);
     const users = await Model.find({}); 
    res.render('/admindashbord',{admin,users})
}catch(error){
   res.redirect('/') 
}

}
module.exports = {
    login,
    adminHome,
    adminValidation,
   
}