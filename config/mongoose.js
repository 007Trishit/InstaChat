const mongoose = require('mongoose');

const env = require('./environment');

const db = mongoose.connect('mongodb://localhost:27017/SocialMedia',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false}).then(
    function() {
        console.log("Connected to database!");
    }
).catch(
    function(err){
        console.log("Error while connecting to DB",err);
    }
);



module.exports = mongoose;