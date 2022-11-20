
const mongoose = require("mongoose");
const Schema = mongoose.Schema


const orderSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: [true, "Must have an userID"]
        },
        orders: [
            {
                products: Array,
                status: {
                    type: String,
                    default: "Pending"
                },
                orderedDate: {
                    type: Date,
                    default: Date.now
                }
            }

        ]
    }
);

module.exports = mongoose.model("Order", orderSchema);





