const mongoose = require('mongoose');
const validator = require('validator');

const user = new mongoose.Schema( {
    title: {
        type:String,
        enum:["Mr", "Mrs", "Miss"],
        required:true,
        trim:true
    },
    
    name: {
        required:true,
        unique:true,
         type:String,
        trim:true
    },

    phone: {
        required:true,
        unique:true,
        type:String,
        trim:true
    },

    email : {
        type : String,
        trim : true,
        unique: true,
        required : true,
        lowercase : true,
       // match : [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    password: {
        required:true,
        unique: true,
        type:String,
        minlength: 8,
        maxlength: 15,
        trim: true
    },

    address: {
        street: {
            type:String,
            trim:true
        },
        city: {
            type:String,
            trim:true
        },
        pincode: {
            type:String,
            trim:true
        }
      }


    }
, { timestamps: true });   
   
module.exports = mongoose.model('userModel', user)