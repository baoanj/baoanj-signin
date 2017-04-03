$(function() {
  $("#register_form input").blur(function() {
    var self = this;
    switch (this.id) {
      case "username":
      case "email":
        if (validator.isFieldValid(this.id, $(this).val())) {
          $.post('/validate-unique', { field: this.id, value: $(this).val() }, function(data, status) {
            if (status == 'success') {
              if (data.isUnique) {
                $("#err_" + self.id).text("");
                validator.form[self.id].status = true;
              } else {
                $("#err_" + self.id).text(validator.getErrorMessage2(self.id));
                validator.form[self.id].status = false;
              }
            }
          }).error(function() {
            $("#err_" + self.id).text("服务器走丢了");
          });
        } else {
          $("#err_" + this.id).text(validator.getErrorMessage1(this.id));
          validator.form[this.id].status = false;
        }
        break;
      case "password":
        if (validator.isPasswordValid($(this).val())) {
          $("#err_password").text("");
          validator.form['password'].status = true;
        } else {
          $("#err_password").text(validator.getErrorMessage1('password'));
          validator.form['password'].status = false;
        }
        break;
      case "repeatpass":
        if ($(this).val() == $("#password").val()) {
          $("#err_repeatpass").text("");
          validator.form['repeatpass'].status = true;
        } else {
          $("#err_repeatpass").text(validator.getErrorMessage1('repeatpass'));
          validator.form['repeatpass'].status = false;
        }
        break;
      default:
    }
  });

  $("#register_form input").focus(function() {
    $("#err_" + this.id).text("");
  });

  $("#reset").click(function() {
    $(".error").text("");
    $("#register_form input").attr("value", "");
  });

  $("#register").click(function() {
    $("#register_form input").blur();
    return validator.isFormValid();
  });
});
