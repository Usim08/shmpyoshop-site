const mongoose = require('mongoose');


const us = new mongoose.Schema({
    playerName: { type: String, required: true },
    discordId: { type: String, required: true },
    discordName: { type: String, required: true }
});

const userinfo = mongoose.model('userinfo', us, 'userinfo');
module.exports = userinfo;
