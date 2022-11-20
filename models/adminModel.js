const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'must provide Password'],
        trim: true,
    }
  
})

const Admin = new mongoose.model('Admin', adminSchema)

module.exports = Admin