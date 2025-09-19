const mongoose = require('mongoose');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter the product Name"],
        trim:true
    },
    description:{
         type:String,
         required:[true,"Please Enter the Product description"],
    },
    price:{
        type:Number,
        required:[true,"Please Enter the pirce for your product"],
        maxLength:[8,"Price cannot exced 8 character"],
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"Please Enter the product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter the product stock"],
        maxlength:[4,"Stock cannot exceed 4 character"],
        default:1
    },
    numofReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
             type:mongoose.Schema.ObjectId,
             ref:"User",
             required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:
    {
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model("Product",productSchema);