
const mongoose = require("mongoose");
const Schema = mongoose.Schema


const CartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require:[true,"Must have an userID"]
    },
    products: [
      {
        productId: String,
        productQuantity: Number,
        productName: String,
        productPrice: Number,
        productImages: Array 
      }]
    ,
    // active: {
    //   type: Boolean,
    //   default: true
    // },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);





