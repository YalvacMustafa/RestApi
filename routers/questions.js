const express = require("express");
const { askNewQuestion, getAllQuestions, getOneQuestions } = require("../controllers/questions");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const checkQuestionExist = require('../middlewares/database/databaseErrorHelpers')
const router = express.Router();

router.post('/ask', getAccessToRoute, askNewQuestion )
router.get('/', getAllQuestions)
router.get('/:id', checkQuestionExist, getOneQuestions)

module.exports = router;