const express = require("express");
const question = require("./questions");
const auth = require("./auth");
const admin = require('./admin')
const router = express.Router();

router.use("/questions", question);
router.use("/auth", auth);
router.use('/admin', admin)

module.exports = router;