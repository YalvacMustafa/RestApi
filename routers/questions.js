const express = require("express");
const answer = require('./answer');
const { askNewQuestion, getAllQuestions, getOneQuestions, updateQuestion, deleteQuestion, likeQuestion, undolikeQuestion } = require("../controllers/questions");
const { getAccessToRoute, getQuestionOwnerAccess } = require("../middlewares/authorization/auth");
const checkQuestionExist = require('../middlewares/database/databaseErrorHelpers')
const router = express.Router();

router.post('/ask', getAccessToRoute, askNewQuestion )
router.get('/', getAllQuestions)
router.get('/:id', checkQuestionExist, getOneQuestions)
router.put('/:id/edit', getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess, updateQuestion)
router.delete('/:id/delete', getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess, deleteQuestion)
router.get('/:id/like', getAccessToRoute, checkQuestionExist, likeQuestion)
router.get('/:id/undolike', getAccessToRoute, checkQuestionExist, undolikeQuestion)
router.use('/:id/answer', checkQuestionExist, answer)
module.exports = router;