$(function() {
  $("#register_form input").blur(function() {
    var self = this;
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
    //alert(validator.isFormValid());
    return true;
  });
});
