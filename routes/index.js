module.exports = function(db) {
  var express = require('express');
  var router = express.Router();
  var debug = require('debug')('baoanj-signin:index');
  var userManager = require('../models/user')(db);

  var currentUser = null; // session未解决

  router.get('/signup', function(req, res, next) {
    if (req.session.user) {
      res.redirect('/detail');
    } else {
      res.render('signup', { title: '用户注册', user: {}, error: {} });
    }
  });

  router.post('/signup', function(req, res, next) {
    var user = req.body;
    userManager.checkSignupUser(user, function(err) {
      try {
        if (Object.keys(err).length > 0) {
          throw new Error(JSON.stringify(err)); // 回调函数里throw的error外部是catch不到的
        }
        req.session.user = user;
        userManager.insertUser(user, function(result) {
          console.log(result.username + ' registed successfully!');
          res.redirect('/detail');
        });
      } catch (err) {
        res.render('signup', { title: '用户注册', user: user, error: JSON.parse(err.message) });
      }
    });
  });

  router.get('/signin', function(req, res, next) {
    if (req.session.user) {
      res.redirect('/detail');
    } else {
      res.render('signin', { title: '用户登录', user: {}, error: {} });
    }
  });

  router.post('/signin', function(req, res, next) {
    var user = req.body;
    userManager.checkSigninUser(user, function(err) {
      try {
        if (err) throw new Error(JSON.stringify(err)); // 回调函数里throw的error外部是catch不到的
        userManager.findUser(user.username, function(result) {
          console.log(result.username + ' login successfully!');
          req.session.user = result;
          res.redirect('/detail');
        });
      } catch (err) {
        res.render('signin', { title: '用户登录', user: user, error: JSON.parse(err.message) });
      }
    });
  });

  router.post('/validate-unique', function(req, res, next) {
    userManager.findAllUser(function(result) {
      res.send(userManager.isAttrValueUnique(result, req.body.field, req.body.value) ? { isUnique: true } : { isUnique: false });
    });
  });

  router.post('/validate-username', function(req, res, next) {
    userManager.findAllUser(function(result) {
      res.send(userManager.isUsernameExisted(result, req.body.username) ? { isExisted: true } : { isExisted: false });
    });
  });

  router.all('*', function(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/signup');
    }
  });

  router.get('/detail', function(req, res, next) {
    res.render('detail', { title: '用户详情', user: req.session.user });
  });

  router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/signin');
  });

  return router;
}
