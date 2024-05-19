const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstname: {type: String, required: true, match: /^[A-Za-z]+$/, maxlength: 100},
    lastname: { type: String,required: true,match: /^[A-Za-z]+$/,maxlength: 100},
    password: { type: String,required: true,minlength: 1,maxlength:100},
    email: {type: String,required: true,unique: true,match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    location:{type:String,required:true,match:/^[A-Za-z0-9]+$/,maxlength:100},
    phoneNumber:{type:String,required:true,minlength:6,maxlength:100},
    foodDetails:{type:String,required:true,match:/^[A-Za-z]+$/,maxlength:200},
    profileImage:{
        type:String,
        validate:{
            validator: function(value){
                const $regex=/\.(jpg|png)$i;
                return RegExp.test(value);
            },
            message: 'profile image must be in JPG or PNG format.',
        },
    },
});
module.exports=mongoose.model('user',userschema);