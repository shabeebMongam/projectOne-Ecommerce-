exports.handleAsync = function(fn){
    // console.log("Ethi");
    return function(req,res,next){
        fn(req,res,next).catch(err=> next(err))
    }
}