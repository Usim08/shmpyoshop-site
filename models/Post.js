const mongoose = require('mongoose');


const website_verifySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true }
});

const Post = mongoose.model('Post', website_verifySchema, 'Post');
module.exports = Post;
