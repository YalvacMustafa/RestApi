const express = require("express");
const {register, getUser, login, logout, imageUpload, forgotPassword, resetPassword, getProfile, getAllProfile, updateProfile} = require("../controllers/auth");
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const checkUserExist = require('../middlewares/database/databaseErrorHelpers');
const router = express.Router();

router.post("/register", register);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post("/upload", [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload);
router.post("/forgotpassword", forgotPassword);
router.put('/resetpassword', resetPassword)
router.get('/Profile', getAccessToRoute, checkUserExist, getProfile);
router.get('/allProfile', getAccessToRoute, getAllProfile);
router.put('/updateProfile', getAccessToRoute, checkUserExist, updateProfile);
module.exports = router;