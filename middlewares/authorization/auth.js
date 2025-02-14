const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const { isTokenInCluded, getAccessTokenFromHeader } = require("../../helpers/authorization/TokenHelpers");
const User = require('../../models/user');
const Question = require('../../models/question');
const getAccessToRoute = (req, res, next) => {
    const {JWT_SECRET_KEY} = process.env;
    
    if (!isTokenInCluded(req)){

        return next(
            new CustomError("You are not authorized to access this route", 401)
        );
    };
    const accessToken = getAccessTokenFromHeader(req);
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {

        if (err) {

            return next(
                new CustomError("You are not authorized to access this route", 401)
            );
        }
        req.user = {

            id : decoded.id,
            name : decoded.name
        }
        next();
    })
};

const getAdminAccess = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (user.role !== 'admin') {
            return next(new CustomError('You are not authorized to enter here.', 403))
        }
        next()
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}

const getQuestionOwnerAccess = async (req, res, next) => {
    const userId = req.user;
    const questionId = req.params.id;

    const question = await Question.findById(questionId)

    if (question.user != userId){
        return next(new CustomError('Only owner can handle this operation', 403))
    }
    next();
    
}
module.exports = {
    getAccessToRoute, getAdminAccess, getQuestionOwnerAccess
};