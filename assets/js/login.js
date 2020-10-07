$(function () {
  // 去注册
  $("#reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  })
  // 去登陆
  $("#login").on("click", function () {
    $(".login-box").show();
    $(".reg-box").hide();
  })
  // 获取表单对象
  var form = layui.form;
  form.verify({
    // 自定义密码验证
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    //   使用layui通过函数设置校验
    repwd: function (value) {
      var pwd = $(".reg-box [name=password]").val();
      // 对比输入框的值来进行判断
      if (value !== pwd) {
        return "两次密码不相同";
      }
    }
  });
  // 获取layer对象从而使用layer内置方法
  var layer = layui.layer;
  // 通过事件委托来进行数据交互监听注册事件
  $("#form_reg").on("submit", function (e) {
    // 取消表单的默认行为
    e.preventDefault();
    // 通过jq使用ajax请求
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val()
      },
      success: function (res) {
        // 通过返回的状态判断是否注册成功
        if (res.status != 0) return layer.msg(res.message);
        layer.msg(res.message);
        // 注册成功模拟点击事件，自动返回登录页面
        $("#login").click();
      }
    })
  })

  // 通过事件委托阻止登录事件默认行为并向服务器请求数据
  $("#form_log").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/login",
      // 快速获取表单
      data: $(this).serialize(),
      success: function (res) {
        // 做判断
        if (res.status != 0) return layer.msg(res.message);
        layer.msg(res.message);
        // 将token保存到本地浏览器
        localStorage.setItem("toke",res.token);
        // 跳转后台界面
        location.href = "/index.html";

      }
    })
  })
})