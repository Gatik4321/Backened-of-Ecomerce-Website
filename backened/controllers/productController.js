const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');

// Create Product (Admin only)
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

// Get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apifeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await apifeature.query;

    if(!products){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        products
    });
});

// exports.getAllProducts=async(req,res)=>{
//     const products = await Product.find();
//     if (!products) {
//         return next(new ErrorHandler("Product not found", 404));
//     }

//     res.status(200).json({
//         success:true,
//         products
//     })
// }

// Update Product (Admin only)
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });
});

// Delete Product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted Successfully"
    });
});

// Get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

// now we are creating the riview for the product
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numofReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});


// get all the product reviews for a single product
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
     const product = await Product.findById(req.query.id);
      

     if(!product){
        return next(new ErrorHandler("Product not found",404));
     }

     res.status(200).json({
        success:true,
        reviews:product.reviews
     });
});

// Now we are writing the review to delelte a product
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // Filter out the review to delete
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let rating = 0;

  if (reviews.length === 0) {
    rating = 0; // 
  } else {
    rating = avg / reviews.length;
  }

  const numofReviews = reviews.length; 

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numofReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  res.status(200).json({
    success: true,
  });
});
