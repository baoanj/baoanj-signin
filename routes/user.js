var express = require('express');
var router = express.Router();
var debug = require('debug')('baoanj-signin:index');

module.exports = function(db) {
  var userManager = require('../models/userModel')(db);

  router.get('/signup', function(req, res, next) {
    if (req.session.user) {
      res.redirect('/user/detail');
    } else {
      res.render('signup', { title: '用户注册', user: {}, error: {} });
    }
  });

  router.post('/signup', function(req, res, next) {
    var user = req.body;
    userManager.checkSignupUser(user)
      .then(userManager.insertUser)
      .then(function(user) {
        req.session.user = user;
        res.redirect('/user/detail');
      })
      .catch(function(error) {
        res.render('signup', { title: '用户注册', user: user, error: error });
      });
  });

  router.get('/signin', function(req, res, next) {
    if (req.session.user) {
      res.redirect('/user/detail');
    } else {
      res.render('signin', { title: '用户登录', user: {}, error: {} });
    }
  });

  router.post('/signin', function(req, res, next) {
    var user = req.body;
    userManager.findUser(user.username, user.password)
      .then(function(user) {
        req.session.user = user;
        res.redirect('/user/detail');
      })
      .catch(function(error) {
        res.render('signin', { title: '用户登录', user: user, error: error });
      });
  });

  router.post('/validate-unique', function(req, res, next) {
    userManager.findAllUser().then(function(result) {
      res.send(userManager.isAttrValueUnique(result, req.body.field, req.body.value) ? { isUnique: true } : { isUnique: false });
    });
  });

  router.post('/validate-username', function(req, res, next) {
    userManager.findAllUser().then(function(result) {
      res.send(userManager.isUsernameExisted(result, req.body.username) ? { isExisted: true } : { isExisted: false });
    });
  });

  router.all('*', function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/user/signup');
    }
  });

  router.get('/detail', function(req, res, next) {
    res.render('detail', { title: '用户详情', user: req.session.user });
  });

  router.get('/signout', function(req, res, next) {
    req.session.destroy(function(err) {
      res.redirect('/user/signin');
    });
  });

  router.use(function(req, res, next) {
    res.redirect('/user/detail');
  });

  return router;
}
