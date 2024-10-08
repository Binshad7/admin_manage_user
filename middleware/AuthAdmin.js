const is_login = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/login')
        console.log(1231);
        
    }
} 
module.exports = {
    is_login
}