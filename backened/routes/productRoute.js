const express = require("express");
const{ getAllProducts,createProduct,updateProduct,deleteProduct, getProductDetails, createProductReview, deleteReview, getProductReviews} = require("../controllers/productController");
const { isAuthenticatedUsers,authorizeRoles} = require("../middleware/auth");

const router=express.Router();

router.route("/products").get(isAuthenticatedUsers,authorizeRoles('Admin'),getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUsers,createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUsers,updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUsers,deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUsers,createProductReview);
router.route("/reviews").delete(isAuthenticatedUsers,deleteReview).get(getProductReviews);
module.exports=router; 
