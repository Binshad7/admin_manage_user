const ObjectID = require('mongoose').Types.ObjectId

const is_login = (req,res,next)=>{
    const user = new ObjectID(req.session.userID)
    if(user){
        console.log('user is login');
        console.log(user);
        
       next()
    }else{
        console.log('user is not login now ');
        
      res.redirect('/login')
    }
} 

const is_logout = (req,res,next)=>{
    if(req.session.userID){
    return  res.redirect('/')  
    }
    next()     
}
module.exports = {
    is_login,
    is_logout
}