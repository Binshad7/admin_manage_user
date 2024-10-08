const is_login = (req,res,next)=>{
    if(req.session.valid){
        next()
    }else{
        res.redirect('/admin/login')
       
       
        
    }
} 
const is_logout = (req,res,next)=>{
    if(!req.session.valid){
        next()
    }else{
        res.redirect('/admin/login')
        console.log('error');  
    }
}
module.exports = {
    is_login,
    is_logout
}