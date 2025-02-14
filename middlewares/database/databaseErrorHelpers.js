const User = require('../../models/user');
const Question = require('../../models/question');
const CustomError = require('../../helpers/error/CustomError');

const checkUserExist = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user){
        return next(new CustomError('There is no such user with that id', 404))
    }
    next();
}

const checkQuestionExist = async (req, res, next) => {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question){
        return next(new CustomError('There is no such question with that id', 404))
    }
    next();
}
module.exports = checkUserExist, checkQuestionExist;