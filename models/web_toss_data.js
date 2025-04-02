const mongoose = require('mongoose');


const to = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    orderId: { type: String, required: true },
    orderName: { type: String, required: true },
    paymentKey: { type: String, required: true },
    amount: { type: String, required: true },
    customerName: { type: String, required: true },
    roblox: { type: String, required: false },
    secret: { type: String, required: true },
    couponNumber: { type: String, required: false },
    userid: {type: String, required: true }
});

const web_toss_data = mongoose.model('web_toss_data', to, 'web_toss_data');
module.exports = web_toss_data;
