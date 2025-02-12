const User = require('../models/user');
const CustomError = require('../helpers/error/CustomError')

const blockUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        user.blocked = !user.blocked;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Block - Unblock successful'
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}   

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        await user.remove();

        return res.status(200).json({
            success: true,
            message: 'Delete Operations Successful'
        })
    } catch(error){
        return next(new CustomError('Internal Server Error', 500))
    }
}
module.exports = { blockUser, deleteUser }