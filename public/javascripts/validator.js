/*--------客户端与服务端共用的表单校验--------------*/
var validator = {
  form: {
    username: {
      status: false,
      errorMessage1: '用户名格式有误',
      errorMessage2: '用户名已存在'
    },
    studentID: {
      status: false,
      errorMessage1: '学号格式有误',
      errorMessage2: '学号已存在'
    },
    telephone: {
      status: false,
      errorMessage1: '电话格式有误',
      errorMessage2: '电话已存在'
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

  isStudentIDValid: function(studentID) {
    return /^[1-9]\d{7}$/.test(studentID);
  },

  isTelephoneValid: function(telephone) {
    return /^[1-9]\d{10}$/.test(telephone);
  },

  isEmailValid: function(email) {
    return /^[a-zA-Z_\-]+@([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isFieldValid: function(fieldname, value) {
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function() {
    return this.form.username.status && this.form.studentID.status && this.form.telephone.status && this.form.email.status;
  },

  getErrorMessage1: function(fieldname) {
    return this.form[fieldname].errorMessage1;
  },

  getErrorMessage2: function(fieldname) {
    return this.form[fieldname].errorMessage2;
  },

  isAttrValueUnique: function(registry, user, attr) {
    for (var i in registry) {
      if (registry[i][attr] == user[attr]) return false;
    }
    return true;
  }
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}
