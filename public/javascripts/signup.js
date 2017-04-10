$(function() {
  $("#register_form input").blur(function() {
    var self = this;
    switch (this.id) {
      case "username":
      case "email":
        if (validator.isFieldValid(this.id, $(this).val())) {
          $.post('/user/validate-unique', { field: this.id, value: $(this).val() }, function(data, status) {
            if (status == 'success') {
              if (data.isUnique) {
                $("#err_" + self.id).text("");
              } else {
                $("#err_" + self.id).text(validator.getErrorMessage2(self.id));
              }
            }
          }).error(function() {
            $("#err_" + self.id).text("服务器走丢了");
          });
        } else {
          $("#err_" + this.id).text(validator.getErrorMessage1(this.id));
        }
        break;
      case "password":
      case "repeatpass":
        if (validator.isFieldValid(this.id, $(this).val())) {
          $("#err_" + this.id).text("");
        } else {
          $("#err_" + this.id).text(validator.getErrorMessage1(this.id));
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
