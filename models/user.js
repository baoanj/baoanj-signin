var bcrypt = require('bcrypt');

module.exports = function(db) {
  var validator = require('../public/javascripts/validator');

  var collection = db.collection('users');

  return {
    insertUser: function(user, callback) {
      collection.insert(user, function(err, result) {
        callback(result);
      });
    },

    findUser: function(username, callback) {
      collection.findOne({ 'username': username }, function(err, result) {
        callback(result);
      });
    },

    findAllUser: function(callback) {
      collection.find({}).toArray(function(err, result) {
        var users = {};
        for (var i = 0; i < result.length; i++) {
          users[result[i].username] = result[i];
        }
        callback(users);
      });
    },

    isAttrValueUnique: function(registry, field, value) {
      for (var i in registry) {
        if (registry[i][field] == value) return false;
      }
      return true;
    },

    isUsernameExisted: function(users, username) {
      return users.hasOwnProperty(username);
    },

    checkSignupUser: function(user, callback) {
      var that = this;
      this.findAllUser(function(users) {
        var err_messages = {};
        if (!validator.isUsernameValid(user['username'])) {
          err_messages['username'] = validator.getErrorMessage1('username');
        }
        if (!that.isAttrValueUnique(users, 'username', user['username'])) {
          err_messages['username'] = validator.getErrorMessage2('username');
        }
        if (!validator.isEmailValid(user['email'])) {
          err_messages['email'] = validator.getErrorMessage1('email');
        }
        if (!that.isAttrValueUnique(users, 'email', user['email'])) {
          err_messages['email'] = validator.getErrorMessage2('email');
        }
        if (!validator.isPasswordValid(user['password'])) {
          err_messages['password'] = validator.getErrorMessage1('password');
        }
        if (user['password'] != user['repeatpass']) {
          err_messages['repeatpass'] = validator.getErrorMessage1('repeatpass');
        }
        callback(err_messages);
      });
    },

    checkSigninUser: function(user, callback) {
      var that = this;
      this.findAllUser(function(users) {
        var err_login = null;
        if (!that.isUsernameExisted(users, user.username)) {
        	err_login = { username: '用户名不存在' };
        	callback(err_login);
        	return;
        }
        bcrypt.compare(user.password, users[user.username].password).then(function(res) {
          if (!res) {
            err_login = { password: '密码错误' };
          }
          callback(err_login);
          return;
        });
      });
    }
  };
}
