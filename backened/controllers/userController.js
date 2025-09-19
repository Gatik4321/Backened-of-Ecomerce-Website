const ErrorHander = require('../utils/errorhandler.js');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendEmail=require('../utils/sendEmail');
const crypto = require('crypto');

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id", // Fixed minor typo
            url: "profilepicurl",
        },
    });

   sendToken(user,201,res);
});





//Login User here we are constructing the function for the user to logged inside the databsew
// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // Checking if both email and password are provided
    if (!email || !password) {
        return next(new ErrorHander("Please Enter the Email & Password", 400));
    }
    // Finding user by email and selecting password (since password field is set to `select: false` in schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    // Comparing the entered password with the stored hashed password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    // Generating JWT token
    sendToken(user,200,res);
});


//designing the method for loging out the User
// We are designing a method that will automatocally log out theUser
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token",null, {
        httpOnly: true,
        expires: new Date(Date.now()), // Set the cookie to expire immediately
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

//Forgot Password
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    //  console.log(req.body.email);
    if(!user){
        return next(new ErrorHander("User not found",404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    //  console.log(resetToken);
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;


    const message=`Your Password reset token is:- \n\n ${resetPasswordUrl} \n\n if you have not
    request this email Please ignore it`;


    try{
   
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery Email`,
            message
        });
        res.status.json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
    }catch(error){
         user.resetPasswordToken=undefined;
         user.resetPasswordExpire=undefined;

         await user.save({validateBeforeSave:false});
         return next(new ErrorHander(error.message,500));

    }
});


//Reset Password
exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    //creating token hash
     const resetPasswordToken =crypto.createHash('sha256').update(req.params.token).digest("hex");

     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt : Date.now()},
     });
 
     if(!user){
        return next(new ErrorHander("Reset Password Token is invalid or has been expired",404));
     }

     if(req.body.password!==req.body.confirmPassword){
          return next(new ErrorHander("Password does not match",400));
     }

     user.password = req.body.password;
     user.resetPasswordExpire=undefined;
     user.resetPasswordToken=undefined;

     await user.save();

     sendToken(user,200,res);
});

//Get User details

exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});

//Now we will create a function to update the password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Passwords do not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

// Now we are going to write the code to update the profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };
//We will add coludinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
    })
    sendToken(user, 200, res);
});

//Get all the users
// if we have to fetch all the users then we will use this function
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});

//get single(user)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander(`User does not exist with ID ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    });
});

//update user role only admin can perform this function
exports.updateUserRole=catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success:true,
    })
    sendToken(user, 200, res);
});

//Delete sny product it is done by admin only
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id); 

    if (!user) {
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 404)); // 
    }

    await user.deleteOne(); 

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
