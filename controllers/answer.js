const Question = require('../models/question');
const Answer = require('../models/answer');
const CustomError = require("../helpers/error/CustomError");
const question = require('../models/question');

const addNewAnswerToQuestion = async (req, res, next) => {
    try {
        const { question_id } = req.params;
        const { user_id } = req.user.id
        const information = req.body;
        const answer = await Answer.create({
            ...information,
            question: question_id,
            user: user_id
        })
        return res.status(201).json({
            success: true,
            data: answer,
        });
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const getAllAnswersByQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id).populate('answer');

        return res.status(200).json({
            success: true,
            count: question.answer.length,
            data: question.answer
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const getSingleAnswersByQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findById(id)
            .populate('question')
            .populate('user');

        return res.status(200).json({
            success: true,
            data: answer
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const updateAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const information = req.body;
        const answer = await Answer.findByIdAndUpdate(id, information, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            success: true,
            data: answer
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const deleteAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { question_id } = req.params;
        await Answer.findByIdAndRemove(id);
        const question = await Question.findById(question_id);
        question.answer.splice(question.answer.indexOf(id));
        await question.save();
        return res.status(200).json({
            success: true,
            message: 'Answer deleted successfuly'
        })

    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const likeAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findById(id);
        if (answer.likes.includes(req.user.id)){
            return next(new CustomError('You already liked this answer', 400));
        }
        answer.likes.push(req.user.id);
        await answer.save();
        return res.status(200).json({
            success: true,
            data: answer
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const undolikeAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findById(id);
        if (!answer.likes.includes(req.user.id)){
            return next(new CustomError('You can not undo like operation for this answer', 400));
        }
        answer.likes.splice(answer.likes.indexOf(id), 1)
        await answer.save();
        return res.status(200).json({
            success: true,
            data: answer
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500));
    }
}
module.exports = { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswersByQuestion, updateAnswer, deleteAnswer, likeAnswer, undolikeAnswer }