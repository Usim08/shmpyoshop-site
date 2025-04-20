const mongoose = require('mongoose');


const to = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    orderId: { type: String, required: true },
    orderName: { type: String, required: true },
    paymentKey: { type: String, required: true },
    amount: { type: String, required: true },
    customerName: { type: String, required: true },
    roblox: { type: String, required: false },
    couponNumber: { type: String, required: false },
    userid: {type: String, required: false },
    failureReason: {type: String, required: true }
});

const pay_fail = mongoose.model('pay_fail', to, 'pay_fail');
module.exports = pay_fail;
