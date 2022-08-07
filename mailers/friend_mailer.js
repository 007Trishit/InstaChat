const nodemailer = require('../config/nodemailer');
const path = require('path');

module.exports.mail = (data,done)=>{
    let body = nodemailer.renderTemplate({user:data.user},'/friend.ejs');
    let path_temp=path.join(__dirname,'..','uploads/users/avatars/avatar-1614153064668');
    if(data.user.avatar){
        path_temp=path.join(__dirname,'..',data.user.avatar);
    }
    nodemailer.transporter.sendMail({
        from:'rishikeshcrever@gmail.com',
        to:data.to,
        subject:'Know Your Friend',
        html:body,
        attachments:[
            {
                filename:'avatar.jpg',
                path:path_temp

            }
        ]
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail",err);
            return;
        }
        console.log(info.response);
        done();
    });
}