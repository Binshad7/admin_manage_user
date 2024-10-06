const is_login = (req,res,next)=>{
    
    if(req.session.userID){
       next()
    }else{
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