const User = require('../../models/user');
const CustomError = require('../../helpers/error/CustomError');

const checkUserExist = async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user){
        return next(new CustomError('There is no such user with that id', 404))
    }
    next();
}
module.exports = checkUserExist;