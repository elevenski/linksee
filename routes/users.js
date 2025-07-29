const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

router.get('/signin', forwardAuthenticated, (req, res) => res.render('signin'));

router.get('/signup', forwardAuthenticated, (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {
  const eleven = true
 // console.log(req.body)
  const { avatar, name, nickname, email, password, password2 } = req.body;
  let errors = [];

  if (!avatar || !name || !nickname || !email || !password || !password2) {
    errors.push({ msg: 'Please Fill All!' });
  }

  if (password != password2) {
    errors.push({ msg: 'The passwords you entered do not match!' });
  }

  /*if (password.length < 6) {
    errors.push({ msg: 'A password can be at least 6 characters!' });
  }*/

  if (errors.length > 0) {
    res.render('signup', {
      errors,
      avatar,
      name,
      nickname,
      email,
      password,
      password2
    });
  } else if (eleven === true) {
    User.findOne({ nickname: nickname}).then(user => {
      if (user) {
        errors.push({ msg: 'This nickname is already registered!' });
        res.render('signup', {
          errors,
          avatar,
          name,
          nickname,
          email,
          password,
          password2
        });
      } else {


    User.findOne({ email: email}).then(user => {
      if (user) {
        errors.push({ msg: 'This email is already registered!' });
        res.render('signup', {
          errors,
          avatar,
          name,
          nickname,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          avatar,
          name,
          nickname,
          email,
          password,
          password2
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.password2;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You have successfully signup, signin now!'
                );
                res.redirect('/users/signin');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
        
      }
    });
  }
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/my/control',
    failureRedirect: '/users/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/signout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You signed out!');
  res.redirect('/users/signin');
});

module.exports = router;
