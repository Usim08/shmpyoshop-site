const mongoose = require('mongoose');


const website_verifySchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    discordId: { type: String, required: true },
    secret: { type: String, required: true },
    name: { type: String, required: true },
    gameLink: { type: String, required: true },
    goodscode: { type: String, required: true },
    goodsname: { type: String, required: true }
});

const save_user_code = mongoose.model('save_user_code', website_verifySchema, 'save_user_code');
module.exports = save_user_code;
