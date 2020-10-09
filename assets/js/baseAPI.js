$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url;

  // 添加验证
  if (options.url.indexOf("/my") !== -1) {
    // 获取存储的token的值进行验证
    options.headers = { Authorization: localStorage.getItem("token") };
  }
  //  验证是否写入验证码
  options.complete = function (res) {
    // console.log(res);
    // 通过responseJSONL来获取状态
    if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
      localStorage.removeItem("token");
      // 跳转到登陆页面
      location.href = "/login.html";
    }
  }
})