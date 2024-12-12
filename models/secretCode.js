const mongoose = require('mongoose');

const secretCodeSchema = new mongoose.Schema({
    secret: { type: String, required: true },
    value: { type: Boolean, required: true },
    goodsname: { type: String, required: true },
    goodsnumber: { type: String, required: true },
    userid: { type: String, required: true }
});

const SecretCode = mongoose.model('SecretCode', secretCodeSchema);
module.exports = SecretCode;
