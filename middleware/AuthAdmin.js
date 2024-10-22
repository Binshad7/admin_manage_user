const is_login = (req,res,next)=>{
    if(req.session.valid){
        console.log('valid ',1);
        
        console.log(  req.session.valid);
        next()
    }else{
        console.log('valid ',2);
        console.log(  req.session.valid,req.session);
        res.redirect('/admin/login')    
    }
} 
const is_true = (req,res,next)=>{
    if(req.session.valid){
        res.redirect('/admin/') 
    }else{
        next()
    }
}
const is_logout = (req,res,next)=>{
    if(!req.session.valid){
        console.log(  req.session.valid,req.session);
        next()
    }else{
        console.log(  req.session.valid,req.session);
        res.redirect('/admin/login')
        console.log('error');  
    }
}
module.exports = {
    is_login,
    is_logout,
    is_true
}