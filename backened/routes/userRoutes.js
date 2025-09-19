const express = require('express');
const {registerUser, loginUser,logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser,getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const { isAuthenticatedUsers,authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route('/register').post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get( isAuthenticatedUsers,getUserDetails);
router.route("/password/update").put(isAuthenticatedUsers,updatePassword);
router.route("/me/update").put(isAuthenticatedUsers,updateProfile);
router.route("/admin/users").get(isAuthenticatedUsers,authorizeRoles("admin"),getAllUser);
router.route("/admin/users/:id").get(isAuthenticatedUsers,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatedUsers,authorizeRoles("admin"),updateUserRole).
delete(isAuthenticatedUsers,authorizeRoles("admin"),deleteUser);

module.exports = router;