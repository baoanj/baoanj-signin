/*--------客户端与服务端共用的表单校验--------------*/
var validator = {
  form: {
    username: {
      status: false,
      errorMessage1: '用户名格式有误',
      errorMessage2: '用户名已存在'
    },
    password: {
      status: false,
      errorMessage1: '密码格式有误'
    },
    repeatpass: {
      status: false,
      errorMessage1: '两次密码不一致'
    },
    email: {
      status: false,
      errorMessage1: '邮箱格式有误',
      errorMessage2: '邮箱已存在'
    }
  },

  isUsernameValid: function(username) {
    return /^[a-zA-Z][a-zA-Z0-9_]{5,18}$/.test(username);
  },

  isPasswordValid: function(password) {
    return /^[0-9a-zA-Z_-]{6,12}$/.test(password);
  },

  isEmailValid: function(email) {
    return /^[a-zA-Z_\-]+@([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isFieldValid: function(fieldname, value) {
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function() {
    return this.form.username.status && this.form.password.status && this.form.repeatpass.status && this.form.email.status;
  },

  getErrorMessage1: function(fieldname) {
    return this.form[fieldname].errorMessage1;
  },

  getErrorMessage2: function(fieldname) {
    return this.form[fieldname].errorMessage2;
  }
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator;
}
