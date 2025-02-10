const express = require("express");
const {register, getUser, login, logout, imageUpload, forgotPassword, getProfile, getAllProfile} = require("../controllers/auth");
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

router.post("/register", register);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post("/upload", [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload);
router.post("/forgotpassword", forgotPassword);
router.get('/Profile', getAccessToRoute, getProfile);
router.get('/allProfile', getAccessToRoute, getAdminAccess, getAllProfile);
module.exports = router;