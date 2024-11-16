const mongoose = require('mongoose');


const website_verifySchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    download: { type: String, required: true }
});

const goodNumber = mongoose.model('goodNumber', website_verifySchema, 'goodNumber');
module.exports = goodNumber;
