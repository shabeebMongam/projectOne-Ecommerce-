exports.isAdminLoggedIn = (req,res,next)=>{
    if(!req.session.adminLoggedIn){
       return res.render('adminFiles/adminLogin')
    }
    next()
}