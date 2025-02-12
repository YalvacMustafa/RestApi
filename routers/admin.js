const express = require('express')
const {getAccessToRoute, getAdminAccess} = require("../middlewares/authorization/auth");
const { blockUser, deleteUser } = require('../controllers/admin')
const checkUserExist = require('../middlewares/database/databaseErrorHelpers');
const router = express.Router();

router.get('/block/:id', getAccessToRoute, getAdminAccess, checkUserExist, blockUser)
router.delete('/delete-user/:id', getAccessToRoute, getAdminAccess, checkUserExist, deleteUser)

module.exports = router;