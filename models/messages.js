const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const mssgSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    type:{
        type:Number
    }
},{timestamps:true});


const mssgModel = mongoose.model('Messages',mssgSchema);
module.exports=mssgModel;