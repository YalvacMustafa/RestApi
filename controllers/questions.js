const Question = require('../models/question')
const CustomError = require('../helpers/error/CustomError')

const askNewQuestion = async (req, res, next) => {
    try {
        const { id } = req.user;
        const information = req.body;
    
        const question = await Question.create({
        ...information,
        user: id
        })

       return res.status(200).json({
            success: true,
            data: question
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();
        return res.status(200).json({
            success: true,
            data: questions
        })
    } catch(error){
        return next(new CustomError('Internal Server Error'))
    }
}

const getOneQuestions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        return res.status(200).json({
            success: true,
            data: question
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}
module.exports = { askNewQuestion, getAllQuestions, getOneQuestions }