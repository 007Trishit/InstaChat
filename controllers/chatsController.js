const Message = require('../models/messages');
const User = require('../models/user');
const queue = require('../config/kue');

module.exports.chatter= async function(req,res){
    const toUser = req.params.to;
    const messages = await Message.find({from:{$in:[req.user.email,toUser]},to:{$in:[req.user.email,toUser]}}).sort('createdAt');
    const other = await User.findOne({email:toUser},{name:1});
    res.render('chatBox',{
        toUser:toUser,
        messages:messages,
        name:other.name
    });
}

module.exports.save= async function(req,res){
    try {
        let mssg = {
            from:req.body.par.from,
            to:req.body.par.to,
            content:req.body.val,
            type:req.body.type
        };
        queue.create('messages',mssg).save((err)=>{
            if(err){
                console.log("Error in enqueueing message into delyed queue");
                return;
            }
            console.log("Message job enqueued!");
        });
        res.status(200).json({message:"Message created successfully!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Unable to create message"});
    }
}