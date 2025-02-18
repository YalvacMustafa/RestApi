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
        return res.status(200).json(res.queryResult)
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

const updateQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const editInformation = req.body;

        const question = await Question.findByIdAndUpdate(id, editInformation, {
            new: true,
            runValidators: true
        })
        return res.status(200).json({
            success: true,
            message: 'Edited successfully',
            data: question
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Question.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'The deletion was completed successfully.'
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const likeQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (question.likes.includes(req.user.id)){
            return next(new CustomError('You already liked this question', 400))
        }
        question.likes.push(req.user.id);
        await question.save();
        return res.status(200).json({
            success: true,
            data: question
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }

}

const undolikeQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question.likes.includes(req.user.id)){
            return next(new CustomError('You can not undo like operation for this question', 400))
        }
        const index = question.likes.indexOf(req.user.id);
        question.likes.splice(index, 1);

        await question.save();
        return res.status(200).json({
            success: true,
            data: question
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}
module.exports = { askNewQuestion, getAllQuestions, getOneQuestions, updateQuestion, deleteQuestion, likeQuestion, undolikeQuestion }