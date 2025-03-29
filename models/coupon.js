const mongoose = require('mongoose');


const coupon_number = new mongoose.Schema({
    couponId: { type: String, required: true },
    sale: { type: String, required: true },
    playerId: { type: String, required: false }
});

const coupon = mongoose.model('coupon', coupon_number, 'coupon');
module.exports = coupon;
