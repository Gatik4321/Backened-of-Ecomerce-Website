const express = require("express");
const router = express.Router();
const { isAuthenticatedUsers,authorizeRoles} = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");


router.route("/order/new").post(isAuthenticatedUsers,newOrder);
router.route("/order/:id").get(isAuthenticatedUsers,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUsers,myOrders);
router.route("/admin/orders").get(isAuthenticatedUsers,authorizeRoles('Admin'),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUsers,authorizeRoles('Admin'),updateOrder).
delete(isAuthenticatedUsers,authorizeRoles('Admin'),deleteOrder);
module.exports = router;