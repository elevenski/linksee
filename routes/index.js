const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Card = require('../models/Cards');
const   { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const request = require("request")
const superagent = require('superagent');

router.get('/', (req, res) => {
  if(req.user) {
    res.redirect("my/control")
  } else {
    res.render('index', {user: req.user})
  }
});

/*router.get('/dashboard', (req, res) => {
    res.redirect('my/control')
});*/

/*router.get('/user', (req, res) => {
    res.render('user', {user: req.user})
});*/

router.get('/discord', function (req,res) {
    res.redirect('https://discord.gg/UsfNUWEWYb')
})

router.get("/my/control", ensureAuthenticated, (req, res)=>{
  User.findById(req.user._id).populate("cards").then((User)=>{
    res.render("control", { 
      user: req.user,
      cards: User.cards,
    });
  })
});

router.post("/card/create", ensureAuthenticated, (req, res)=>{
  const { title, link } = req.body;


    const newCard = new Card({
      user: req.user._id,
      title,
      link
    });
  
      User.findById(req.user._id).then((rUser)=>{
        if(!rUser){
            return res.redirect("/my/control");
        }

            Card.create(newCard).then((rCard) => {
             rUser.cards.push(rCard._id);
             rUser.save();
              rCard.save()
              .then(Card => {
                req.flash(
                  'success_msg',
                  'Congratulations! You have successfully added your card!'
                );
                res.redirect('/my/control');
              })
              
            })


    });
});

router.post('/account', ensureAuthenticated, async (req, res) => {
  const { bio, twitch, mail, website, discord, linkedin, name, avatar, facebook, instagram, twitter, youtube, github } = req.body;

  await User.findOneAndUpdate({ _id: req.user.id }, {$set: {
    name: name,
    avatar: avatar,
    bio: bio,
    website: website, discord: discord, linkedin: linkedin,
    facebook: facebook, instagram: instagram, 
    twitter: twitter, youtube: youtube, github: github,
    twitch: twitch, mail: mail
  }}, {new: true, returnOriginal: false})

  res.redirect("/my/control")
  req.flash(
                  'success_msg',
                  'OK'
                );
});

router.get("/:nickname", (req, res)=>{
  var nickname = req.params.nickname
    User.findOne({nickname: nickname}).populate("cards").then((User)=>{
        res.render("user", { 
            avatar: User.avatar || "data:image/png;base64,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",
            name: User.name,
            nickname: User.nickname,
            bio: User.bio,
            facebook: User.facebook,
            instagram: User.instagram,
            twitter: User.twitter,
            youtube: User.youtube,
            github: User.github,
            website: User.website,
            discord: User.discord,
            linkedin: User.linkedin,
            twitch: User.twitch,
            mail: User.mail,
            /*custom_one_title: User.custom_one_title,
            custom_one_link: User.custom_one_link,
            custom_two_title: User.custom_two_title,
            custom_two_link: User.custom_two_link,
            custom_three_title: User.custom_three_title,
            custom_three_link: User.custom_three_link,*/
            cards: User.cards,
            verified: User.verified
            });
    }).catch((e)=>{
        res.render("404");
      console.log(e)
    });
});

module.exports = router;
