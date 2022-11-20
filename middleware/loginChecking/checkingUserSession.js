exports.isUserLoggedIn = (req,res,next)=>{
    if(!req.session.userLoggedIn){
       return res.render('userFiles/loginPage')
    }
    next()
}