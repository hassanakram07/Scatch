const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    Image: Buffer,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
    },
    bgcolor: String,
    panelecolor: String,
    textcolor: String,
});

module.exports = mongoose.model("product" , productSchema);
