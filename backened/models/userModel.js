const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
// we have to encrypt the password before saving it
//hence we are using bycrypt at the top

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name cannot exceed more than 30 characters"],
        minLength: [4, "Name should have more than 4 characters"] // Fixed typo
    },
    email: {
        type: String,
        required: [true, "Please enter Your email"],
        unique: true,
        // validator is used to check whether our email is up to the mark or not
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
              next();
    }

    this.password=await bcrypt.hash(this.password,10);

});

//JWT TOKEN
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

//comparing password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

//Generating Password reset token
userSchema.methods.getResetPasswordToken=function(){
     //Generating Token
     const resetToken = crypto.randomBytes(20).toString("hex");

     //Hashing and adding resetPassword Token to UserSchema
     this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

     this.resetPasswordExpire=Date.now()+15*60*1000;

     return resetToken;
}

module.exports = mongoose.model("User", userSchema);
