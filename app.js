var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

//load environment variables
dotenv.load();

//defne routes
var routes = require('./routes/index');

var strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  'http://localhost:3000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

// Here we are adding the Auth0 Strategy to our passport framework
passport.use(strategy);

// The searlize and deserialize user methods will allow us to get the user data once they are logged in.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


//define app
app = express();

//set options for express framework
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// use method for app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(
    session({
        secret: 'shhhhhh',
        resave: true,
        saveUninitialized: true
    }));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//use express
app.use('/', routes);

//catch 404 and forward to error handler

app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);

});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.send(err);
  res.render('error', {
      message: err.message,
      error: err
  });
});

//finally port for listening
app.listen(3000);