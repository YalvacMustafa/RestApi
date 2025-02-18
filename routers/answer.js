const express = require('express')
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth')
const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswersByQuestion, updateAnswer, deleteAnswer, likeAnswer, undolikeAnswer } = require('../controllers/answer')
const checkAnswerExist = require('../middlewares/database/databaseErrorHelpers')
const router = express.Router({ mergeParams:true });

router.post('/', getAccessToRoute, addNewAnswerToQuestion)
router.get('/', getAllAnswersByQuestion)
router.get('/:id', checkAnswerExist, getSingleAnswersByQuestion)
router.put('/:id/edit', checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess, updateAnswer)
router.delete(':id/delete', checkAnswerExist, getAccessToRoute, getAnswerOwnerAccess, deleteAnswer)
router.get(':id/like', checkAnswerExist, getAccessToRoute, likeAnswer)
router.get(':id/undolike', checkAnswerExist, getAccessToRoute, undolikeAnswer)

module.exports = router;