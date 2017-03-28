var express = require('express');
var router = express.Router();

var users = {};
var currentUser = null; // session未解决

router.get('/signup', function(req, res, next) {
  if (currentUser) res.redirect('/detail');
  else res.render('signup', { title: '用户注册', user: {}, error: {} });
});

router.post('/signup', function(req, res, next) {
  var user = req.body;
  try {
    checkUser(user);
    currentUser = users[user.username] = user;
    res.redirect('/detail');
  } catch (err) {
    res.render('signup', { title: '用户注册', user: user, error: err.message })
  }
});

router.post('/validate-unique', function(req, res, next) {
  res.send({ isUnique: true });
  //return {isUnique: true}; // 导致响应奇慢无比
});

router.all('*', function(req, res, next) {
  currentUser ? next() : res.redirect('/signup');
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { title: '用户详情', user: currentUser });
});

router.get('/signout', function(req, res, next) {
  currentUser = null;
  res.redirect('/signup');
});

function checkUser(user) {

}

module.exports = router;
