var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');


var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

//callback to invoke authentication using auth0 locks
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/polls');
  });


router.get('/', function(req, res, next){
   //res.send('You are on the homepage');
   res.render('index', {env:env});
});

router.get('/login', function(req, res, next){
   //res.send('You are on the login page');
   res.render('login', {env:env});
});

router.get('/logout', function(req, res, next){
   //res.send('You are on the logout page');
   req.logout();
   res.redirect('/');
});

router.get('/polls', function(req, res, next){
   //res.send('You are on the polls page');
   request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var polls = JSON.parse(body);
      // For this view, we are not only sending our environmental information, but the polls and user information as well.
      res.render('polls', {env: env, user: req.user, polls: polls});
    } else {
      res.render('error');
    }
  })
});

router.get('/users', function(req, res, next){
   //res.send('You are on the user page');
   res.render('user', { env: env, user: req.user });
});

module.exports = router;