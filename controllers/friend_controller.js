const User=require('../models/user');

const queue = require('../config/kue');

module.exports.add = async function(req,res){
    await req.user.friends.push(req.params.id);
    await req.user.save();
    const user = await User.findById(req.params.id);
    user.friends.push(req.user._id);
    user.save();
    queue.create('emails',{to:user.email,user:req.user}).save((err)=>{
        if(err){
            console.log("Error in queueing in mail!");
            return;
        }
    });
    return res.redirect(`/users/profile/${req.params.id}`);
}

module.exports.remove = async function(req,res){
    await req.user.friends.pull(req.params.id);
    await req.user.save();
    const user = await User.findById(req.params.id);
    user.friends.pull(req.user._id);
    user.save();
    return res.redirect(`/users/profile/${req.params.id}`);
}