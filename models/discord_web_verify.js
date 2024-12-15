const mongoose = require('mongoose');


const d = new mongoose.Schema({
    userName: { type: String, required: true },
    verifyCode: { type: String, required: true },
    managerId: { type: String, required: true },
    webCode: { type: String, required: true },
    channelId: { type: String, required: true },
    value: { type: Boolean, required: true }
});

const discord_web_verify = mongoose.model('discord_web_verify', d, 'discord_web_verify');
module.exports = discord_web_verify;
