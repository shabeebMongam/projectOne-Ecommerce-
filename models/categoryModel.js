const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    categoryName: String, 
    
})

const Category  =new mongoose.model("Category",categorySchema);

module.exports = Category