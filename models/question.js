const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: { type: String, required: true, minlength: 10, unique: true},
    content: { type: String, required: true, minlength: 20},
    slug: { type: String },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    answer: [{ type: mongoose.Schema.ObjectId, ref: 'Answer' }]
})
QuestionSchema.pre('save', function(next){
    if (!this.isModified('title')){
        next;
    }
    this.slug = this.makeSlug();
    next();
})
QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true
    })
}
module.exports = mongoose.model('Question', QuestionSchema)