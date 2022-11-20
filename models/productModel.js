const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productName : String,
    productPrice : Number,
    productQuantity : Number,
    productCategory : String,
    productDescription : String,
    productImages: Array,
    
})

const Product  =new mongoose.model("Product",productSchema);

module.exports = Product