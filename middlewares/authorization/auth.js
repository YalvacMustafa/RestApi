const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const { isTokenInCluded, getAccessTokenFromHeader } = require("../../helpers/authorization/TokenHelpers");
const User = require('../../models/user');
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
module.exports = {
    getAccessToRoute, getAdminAccess
};