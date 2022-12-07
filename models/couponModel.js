const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    code: {
        type: String,
    },
    percentage: {
        type: String,
    },
    quantity: {
        type: String
    },
    usedBy: {
        type: Array
    },


})

const Coupon = new mongoose.model('Coupon', couponSchema)

module.exports = Coupon