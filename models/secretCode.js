const mongoose = require('mongoose');

const secretCodeSchema = new mongoose.Schema({
    secret: { type: String, required: true },
    value: { type: Boolean, required: false },
    goodsname: { type: String, required: true },
    goodscode: { type: String, required: true },
    goodsname: { type: String, required: true },
    userid: { type: String, required: true }
});

const SecretCode = mongoose.model('SecretCode', secretCodeSchema);
module.exports = SecretCode;
