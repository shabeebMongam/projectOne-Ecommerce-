const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    name: {
        type: String,
        required: [true, 'must provide Name'],
      
    },
    address: {
        type: String,
        required: [true, 'must provide Address'],
      
    },
    zipCode: {
        type: String,
        required: [true, 'must provide zipCode'],
      
    },
    mobileNumber: {
        type: String,
        required: [true, 'must provide mobileNumber'],
      
    },
  
  
})

const Address = new mongoose.model('Address', addressSchema)

module.exports = Address