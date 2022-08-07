const Post = require('../models/post');
const User = require('../models/user');



module.exports.home = async function(req, res){

    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user','name')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            }
        });
        let users = await User.find({});
        let friends = null;
        if(req.isAuthenticated()){
            let user = await User.findById(req.user._id).populate('friends','name _id');
            friends = user.friends;
        }
        return res.render('home', {
            title: "Interaxia",
            posts:  posts,
            all_users: users,
            friends:friends
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
