var express = require('express');
var router = express.Router();
// var pwUtil = require('../helpers/password');
var bcrypt = require('bcryptjs');
var User = require('../models').truck;

//this is the users_controller.js file
router.get('/signup-signin', function(req,res) {
	res.render('trucks/signup-signin', {
		layout: 'main-registration'
	});
});


//http://localhost:3000/trucks/truck
router.get('/truck', function(req,res) {
  res.render('trucks/truck', {
    layout: 'main-registration'
  });
});




router.post("/sign-up", function(req, res) {
  User.find({
    email: req.body.email
  }, function(err, users) {
    if (users.length > 0){
      console.log(users)
      res.send('we already have an email or username for this account')
    }else{

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
      
      var user = new User({
        username: req.body.username,
        password_hash: hash,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName

      });

      user.save(function(err) {

        if(err) throw err;

        req.session.logged_in = true;
        // the username to the session
        req.session.username = user.username;
        // and the user's email.
        req.session.user_email = user.email;

        req.session.firstName = user.firstName;

        req.session.lastName = user.lastName;


        res.render('truck', {
          email: req.session.user_email,
          logged_in: req.session.logged_in,
          username: req.session.username,
          firstName: req.session.firstName,
          lastName: req.session.lastName

            });
          });
        });
      });
    };
  });
});


router.post("/sign-in", function(req, res) {
  User.find({email: req.body.email}, function(err, users) {
    if(err) throw err;
    if(users.length > 1) throw new Error("More than one user with the same name!");

    var user = users[0];
    user.validatePassword(req.body.password, function(err, success) {
      if(err) throw err;

      if(success) {

        req.session.logged_in = true;
        // the username to the session
        req.session.username = user.username;
        // and the user's email.
        req.session.user_email = user.email;

        req.session.firstName = user.firstName;

        req.session.lastName = user.lastName;

        res.render('index', {
          email: req.session.user_email,
          logged_in: req.session.logged_in,
          username: req.session.username,
          firstName: req.session.firstName,
          lastName: req.session.lastName
        });
      } else {
        req.session.logged_in = false;
        res.redirect("index");
      }
    });
  });
});

router.get("/sign-out", function(req,res) {
  req.session.destroy(function(err) {
     res.redirect("/")
  })
});

module.exports = router;
