const mongoose = require('mongoose');

const secretCodeSchema = new mongoose.Schema({
    secret: { type: String, required: true },
    ID: { type: String, required: false } // 필요에 따라 추가
});

const SecretCode = mongoose.model('SecretCode', secretCodeSchema);
module.exports = SecretCode;
