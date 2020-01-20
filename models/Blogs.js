const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    blog: {type: Object, required: true},
    title: {type: String, default: ''},
},{timestamps: true});

module.exports = mongoose.model("Blogs", blogSchema);