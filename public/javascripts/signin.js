$(function() {
  var usernameFlag = false, passwordFlag = false;
  $("#login_form input").blur(function() {
    var self = this;
    switch (this.id) {
      case "username":
        if ($(this).val() == "") {
          $("#err_username").text("请输入用户名");
        } else {
          $.post('/validate-username', { username: $(this).val() }, function(data, status) {
            if (status == 'success') {
              if (data.isExisted) {
                $("#err_username").text("");
                usernameFlag = true;
              } else {
                $("#err_username").text("用户名不存在");
                usernameFlag = false;
              }
            }
          }).error(function() {
            $("#err_username").text("服务器走丢了");
            usernameFlag = false;
          });
        }
        break;
      case "password":
        if ($(this).val() == "") {
          $("#err_password").text("密码不能为空");
          passwordFlag = false;
        } else {
          passwordFlag = true;
        }
        break;
      default:
    }
  });

  $("#login_form input").focus(function() {
    $("#err_" + this.id).text("");
  });

  $("#reset").click(function() {
    $(".error").text("");
    $("#login_form input").attr("value", "");
  });

  $("#login").click(function() {
    $("#login_form input").blur();
    return usernameFlag && passwordFlag;
  });
});
