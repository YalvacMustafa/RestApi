const User = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/TokenHelpers");
const { validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail"); 

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendJwtToClient(user, res);
});
const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }
  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout success",
    });
});
const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
};
const imageUpload = asyncErrorWrapper(async (req, res, next) => {

  const user = await User.findByIdAndUpdate(req.user.id, {

    "profile_image" : req.savedProfileImage
  }, {
    new : true, 
    runValidators : true
  });

  res.status(200)
  .json({

    success : true,
    message : "Image upload successfull",
    data : user
  });

});

// Fargot Password 

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});

    if(!user){

      return next(new CustomError("There is no user with that email", 400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
      <h3> Reset Your Password </h3>
      <p> This <a href= '${resetPasswordUrl}' target = '_blank'>link</a> will expire in one hour</p>
    `;

    try {
      await sendEmail({

        from : process.env.SMTP_USER,
        to : resetEmail,
        subject : "Reset your password",
        html : emailTemplate
      });

      return res.status(200).json({

        success : true,
        message : "Token sent to your email"
      });
    } 

    catch(err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      
      return next(new CustomError("Email could not be sent", 500));
    }
});
const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user.id;
    const user = User.findById(id)
      .select('-password -role')

    if (!user){
      return next(new CustomError('User not found', 404))
    }
    return res.status(200).json({
      success: true,
      data: user
    })
  } catch(error){
    return next(new CustomError('Internal Server Error', 500))
  }
}

const getAllProfile = async (req, res, next) => {
  try {
    const user = await User.find()
      .select('-password -role -createdAt')
    
    if (!user){
      return next(new CustomError('User not found', 404))
    }
    return res.status(200).json({
      success: true,
      data: user
    })
  } catch(error){
    return next(new CustomError('Internal Server Error', 500))
  }
}
module.exports = { register, getUser, login, logout, imageUpload, forgotPassword, getProfile, getAllProfile };
