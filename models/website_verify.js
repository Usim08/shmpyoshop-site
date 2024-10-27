const mongoose = require('mongoose');


const website_verifySchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    verifyCode: { type: String, required: true },
});

const WebsiteVerify = mongoose.model('WebsiteVerify', website_verifySchema, 'website_verify');
module.exports = WebsiteVerify;
