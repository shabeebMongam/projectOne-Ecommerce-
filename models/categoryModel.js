const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    categoryName: String,
    categoryImage: String,
    categoryShowStatus: {
        type: Boolean,
        default: true
    }
})

const Category = new mongoose.model("Category", categorySchema);

module.exports = Category