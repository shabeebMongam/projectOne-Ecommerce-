const { check, validationResult } = require('express-validator');




exports.validatingUserLoginPartOne = [
    // .isNumeric().withMessage("Enter a valid number")
    check('loginNumber').trim().not().isEmpty().withMessage("Number is empty"),
    check('loginPassword').trim().not().isEmpty().withMessage("Password is empty")
]   

exports.validatingUserLoginPartTwo= (req,res,next) =>{
    const result = validationResult(req).array()
    // console.log(result.length);
    let errors = []
    if(result.length > 0){
        for(errMsg of result){
            errors.push(errMsg.msg)
            // console.log("h");
            // console.log(errMsg.msg);
        }
        // console.log(errors);
        req.flash('validationLogin', errors)
        res.redirect('/login')
    }else{
        // console.log("h");
        next()
    }
}