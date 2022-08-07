const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const db = require('./config/mongoose');
const path = require('path');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const logger = require('morgan');

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const env = require('./config/environment');
const mongoConnect = require('connect-mongo');

// if(env.name=='development'){
//     app.use(sassMiddleware({
//         src: path.join(env.statics,'scss'),
//         dest: path.join(env.statics,'css'),
//         debug: true,
//         outputStyle: 'expanded',
//         prefix: '/css'
//     }));
// }
app.use(express.urlencoded({extends:false}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname,env.statics)));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// extract style and scripts from sub pages into the layout


app.use(logger(env.morgan.type,env.morgan.options));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

const ServerGawd = require('http').Server(app);
require('./config/chatBackend').chatSockets(ServerGawd);

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 10)
    },
    store:mongoConnect.create({mongoUrl:'mongodb://localhost:27017/SocialMedia'})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));


ServerGawd.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
