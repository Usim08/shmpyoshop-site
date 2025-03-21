const mongoose = require('mongoose');


const website_verifySchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    download: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: String, required: false },
    tag: { type: String, required: true },
    res: { type: String, required: false },
    pus: { type: String, required: false }
});

const goodNumber = mongoose.model('goodNumber', website_verifySchema, 'goodNumber');
module.exports = goodNumber;
