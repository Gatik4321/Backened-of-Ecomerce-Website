// Now we are defining the importnt function like user authentication

const catchAsyncErrors = require("./catchAsyncErrors");
const User = require('../models/userModel');
const ErrorHander = require('../utils/errorhandler');
const jwt = require('jsonwebtoken');


exports.isAuthenticatedUsers = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    // Decode Token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch User from DB
    req.user = await User.findById(decodedData.id);

    if (!req.user) {
        return next(new ErrorHander("User not found", 404));
    }

    next();
});


 exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHander(`Role : ${req.user.role} is not allowed to acess this resource`,403));
        }
    next();
    };
}