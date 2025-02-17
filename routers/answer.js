const express = require('express')
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth')
const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswersByQuestion, updateAnswer } = require('../controllers/answer')
const checkAnswerExist = require('../middlewares/database/databaseErrorHelpers')
const router = express.Router({ mergeParams:true });

router.post('/', getAccessToRoute, addNewAnswerToQuestion)
router.get('/', getAllAnswersByQuestion)
router.get('/:id', checkAnswerExist, getSingleAnswersByQuestion)
router.put('/:id', checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess, updateAnswer)

module.exports = router;