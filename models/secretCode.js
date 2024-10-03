const mongoose = require('mongoose');

const secretCodeSchema = new mongoose.Schema({
    secret: { type: String, required: true },
    userid: { type: String, required: false }
});

const SecretCode = mongoose.model('SecretCode', secretCodeSchema);
module.exports = SecretCode;
