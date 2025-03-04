const mongoose = require('mongoose')
const Question = require('./question')
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content: { type: String, required: true, minlength: 10, },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.ObjectId, ref: 'Question', required: true }
})

AnswerSchema.pre('save', async function(next) {
    if (!this.isModified('user')) next();
    try {
        const question = await this.question.findById(this.question);
        question.answers.push(this._id);
        await question.save();
        next();
    } catch(err){
        return next(err)
    }
})
module.exports = mongoose.model('Answer', AnswerSchema)