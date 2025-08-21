const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: {type:String,
        required:true},

    cart: {
        type : Array,
        default : []
    },
    
    orders: {
        type: Array,
         default: []
   },
   contact: Number,
   picture: String,
});

module.exports = mongoose.model("user" , userSchema);