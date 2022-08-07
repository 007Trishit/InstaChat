
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDir = path.join(__dirname,'../production_logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir)

const accessLogstream = rfs.createStream('access.log', {
    interval:'1d',
    path:logDir
});

let development = {
    name:'development',
    session_secret:'halamadrid',
    statics: '/public/assets/',
    db:'SocialMedia',
    mailerConfig:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'youremail',
            pass: 'yourpassword'
        },
        tls:{
            rejectUnauthorized:false
        }
    },
    jwt_secret:'halamadrid',
    google_clientID: "775944724507-6i38969ggtrfrs9qvrig039ikje29ik9.apps.googleusercontent.com",
    google_clientSecret: "mm95necIguRiO12T8oNQYJOr",
    google_callbackURL: "http://localhost:8000/users/googleAuth",
    morgan:{
        type:'dev',
        options:{
            stream:accessLogstream
        }
    }    
};

let production = {
    name:'production',
    session_secret:process.env.session_secret,
    statics: process.env.statics,
    db:process.env.db,
    mailerConfig:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.email,
            pass: process.env.email_pass
        },
        tls:{
            rejectUnauthorized:false
        }
    },
    jwt_secret:process.env.jwt_secret,
    google_clientID: process.env.google_clientID,
    google_clientSecret: process.env.google_clientSecret,
    google_callbackURL: "http://localhost:8000/users/googleAuth",
    morgan:{
        type:'combined',
        options:{
            stream:accessLogstream
        }
    }        
}

module.exports=development;
