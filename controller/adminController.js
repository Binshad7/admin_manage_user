
const Model = require('../models/userModel')
const bcrypt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId  //// update user id not object id thats y youse this 
const fs = require('fs')
const path = require('path')
const Mail = require('../config/mailVeriFication')
const { use } = require('bcrypt/promises')

// login page render
const login = (req,res) => {
    console.log("admin log");
    res.render('admin/login')
}
 // admin validation
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
   // render admin home       
const adminHome =async (req,res)=>{
    try{
        
     let admin = await Model.findOne({_id:req.session.admin}); 
     
     const users = await Model.find(); 

    res.render('admin/admindashbord',{admin,users})
}catch(error){
   res.redirect('/')  
}
}


// edit user 

const editUser =async (req,res)=>{
    try{
        console.log(req.params.userID);
        let error = req.session.error 
        req.session.error = null
        let _id = new ObjectId(req.params.userID)
      const user = await Model.findOne({_id})
         
      res.render('admin/edit',{user,error})
    }catch(error){  
        console.log(error);
    }

}

const updateProfile =async (req,res)=>{

    try{
    let {userID, name ,email,password,is_admin} = req.body;
    const updateData = {name};
    const _id =new ObjectId(userID);
    const  user =await Model.findOne({_id});
    
    if(email === user.email){
        updateData.email = email
    }else{
        const userExist = await Model.find({email})
        console.log(userExist);
        
        if(userExist.length == 0){
            updateData.email = email;
        }else{
            
            req.session.error = 'User already exist with the same email'
            
            return  res.redirect(`/admin/edituser/${_id}`)
        }
    }
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
    
    if(password){
        password = await bcrypt.hash(password,10);
        updateData.password = password;
    }
    
    
    if(image){
        updateData.image = image
    }
    is_admin = is_admin =='admin'?true:false
    updateData.is_admin = is_admin
    let updated = await Model.updateOne({_id:_id},{$set:updateData})
    console.log(updated);
    
     res.redirect('/admin/')  
    }catch(error){
       console.log(error);
    }
}
  // logout for admin
const logout = (req,res)=>{
    console.log("logout ");
    
    req.session.valid = false
    req.session.destroy()
    res.redirect('/login')
}
  // delete every one
 const deleteUser =async (req,res)=>{
    try{
        const _id = req.params.userID
        const user = await Model.findOne({_id});
        if(user){
            const delete1 = await Model.deleteOne({_id:user._id})  
            res.redirect('/admin/')
        }
    }catch(error){
        console.log(error);
        
    }
 }

  // load that new  user page
  const addNewLoad = (req,res)=>{
      res.render('admin/addNewUser')
  }
 // add new user and admin also 
  const addNewUser =async (req,res)=>{

    try{
    let  {name,email,password,is_admin} = req.body
    console.log(req.body);
      
    is_admin = is_admin == 'true'? true:false
    
    let image = req.file.filename
    const userExist = await Model.findOne({email});
    if(!userExist){
        
        password = await  bcrypt.hash(password,10)
        const newUser = new Model({
            name,
            email,
            image,
            password,
            is_admin
        })
        let added = await newUser.save()
        
        Mail.sendVeriFyMail(added.name, added.email, added._id)
          let msg = is_admin == true ? 'New Admin create Completed':'New User Create Completed'
       return res.status(200).json({status:200,msg:msg})
    }else{
         return   res.status(409).json({status:409,msg:"User Already is Exist With Same Email"})
    }
}catch(error){
    console.error(error);
    res.json({status:500,error:'Server Side Error'}).status(500)
}
  }


  // sort data

  const sortData =async (req,res)=>{
    try{
        const data = req.body.value
        
          if(data === "All"){
              
         const allData = await Model.find();
         
         res.json({status:true,msg: allData})
         
        }
        else{
            let userType =  data==="admin" ? true : false
            const result = await Model.find({is_admin: userType})
            res.json({status: true, msg:result})
        }
    }catch(error){
        res.json({status:false,msg:error.message})
    }
  }

  const searchData =async (req,res)=>{
    try{
        const search = req.body.data || '';
        console.log(search);
  
      const users = await Model.find({name:new RegExp('^'+ search ,'i')})
    
      if(users.length > 0){
        res.status(200).json({status:true,msg:users})
      }else{
        res.status(404).json({status:false,msg:'Not found the users from they DB'})
      }

    }catch(error){
        console.log(error);
       res.status(500).json({status:500,msg:error})
    }

  }

  
 module.exports = {
    login,
    adminHome,
    adminValidation,
    logout,
    editUser,
    updateProfile,
    deleteUser,
    addNewLoad,
    addNewUser,
    sortData,
    searchData
}