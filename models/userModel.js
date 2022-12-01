const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'must provide name'],
        trim: true,
    },
    mobileNumber: {
        type: String,
        require: [true, 'Must Have a Number'],
    },
    email:{
        type:String,
    },
    password: {
        type: String,
        require: [true, 'Must have a Password'],
    },
    access: {
        type: Boolean,
        require: [true, "Must have a access value"]
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref : 'Product'
    },
    wishlist:{
        type: Schema.Types.ObjectId,
        ref : 'Product'
    },
    address:[
        {
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
        }
    ]

    

  
})

const User = new mongoose.model('User', userSchema)

module.exports = User