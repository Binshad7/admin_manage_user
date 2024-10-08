
const Model = require('../models/userModel')
const bcrypt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId  //// update user id not object id thats y youse this 
const fs = require('fs')
const path = require('path')

const login = (req,res) => {
    console.log("admin log");
    res.render('admin/login')
}

const adminValidation = async (req,res)=>{
    const {email, password} = req.body
    try{
    const userValid = await Model.findOne({email,is_admin: true});
     if(userValid){
        let comparePass =  bcrypt.compareSync(password,userValid.password)
        if(comparePass ){
            req.session.admin = userValid._id
            req.session.valid = true

           res.status(200).json({status:200,msg:'Login completed'})
        }else{
    
          res.status(401).json({status:409,error:'User Password in Not match'});
        }
     }else{
        res.status(401).json({status:400,error:'Mail Not Valid'})
     }
    }catch(error){
        res.status(500).json({status:400,error:'Some thing happen the server try after'})
    }
}
          
const adminHome =async (req,res)=>{
    try{
        
     let admin = await Model.findOne({_id:req.session.admin}); 
     
     const users = await Model.find({is_admin:false}); 
    res.render('admin/admindashbord',{admin,users})
}catch(error){
   res.redirect('/')  
}
}


// edit user 
 
const editUser =async (req,res)=>{
    try{
        console.log(req.params.userID);
        
      const user = await Model.findOne({_id:req.params.userID})
      res.render('admin/edit',{user})
    }catch(error){  
        console.log(error);
    }

}

const updateProfile =async (req,res)=>{

    try{
    const {userID, name ,email,password} = req.body;
    const _id =new ObjectId(userID);
    const  user =await Model.findOne({_id});
    
  
    let image;
    if(req.file){
        image = req.file.filename;

        // if file available then delete old image form tha folder
        const oldImage = path.join(__dirname,`../public/userImages/${user.image}`)
        if(fs.existsSync(oldImage)){
              fs.unlink(oldImage,(error)=>{
                
                if(error){
                    console.log("Some went wrong ",error);
                }else{
                    console.log('deleted');
                }
              })
        }else{
            console.log('file not found');
            
        }
    } 
    const updateData = {name,email};
    if(password){
        password = await bcrypt.hash(password,10);
        updateData.password = password;
    }

    if(image){
        updateData.image = image
    }
    let updated = await Model.updateOne({_id:_id},{$set:updateData})
    console.log(updated);
    
     res.redirect('/admin/')  
    }catch(error){
       console.log(error);
    }
}

const logout = (req,res)=>{
    console.log("logout ");
    
    req.session.valid = false
    req.session.destroy()
    res.redirect('/login')
}



module.exports = {
    login,
    adminHome,
    adminValidation,
    logout,
    editUser,
    updateProfile
}