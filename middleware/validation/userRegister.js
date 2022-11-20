const { check, validationResult } = require('express-validator');




exports.validatingUserRegisterPartOne = [
    // .isNumeric().withMessage("Enter a valid number"),
    check('name').trim().not().isEmpty().withMessage("Name is empty"),
    check('number').trim().not().isEmpty().withMessage("Number is empty"),
    check('password').trim().not().isEmpty().withMessage("Password is empty")
]   

exports.validatingUserRegisterPartTwo= (req,res,next) =>{
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
        req.flash('validationRegister', errors)
        res.redirect('/register')
    }else{
        // console.log("h");
        next()
    }
}