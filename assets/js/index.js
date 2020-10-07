$(function () {
    // 调用
    getUserInfo();
})

/**
 * 获取用户
 */
var layer = layui.layer;
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token")
        // },
        success: function (res) {
            if (res.status != 0) return layer.msg(res.message);
            renderAvatar(res.data);
        }
    });
}

/* 
  点击退出链接退出页面并跳转到登录页面
*/
$("#out").on("click", function () {
    // 使用layui内置方法
    layer.confirm('是否选择退出', { icon: 3, title: '提示' }, function (index) {
        // 选择退出时清空本地存储
        localStorage.removeItem("token");
        // 跳转到登陆页面
        location.href = "/login.html";
        layer.close(index);
    });
})
/**
 * 渲染用户信息
 */
function renderAvatar(user) {
    var name = user.username || user.nickname
    // 判断用户是否有头像
    if (user.user_pic !== null) {
        // 图片显示，文字头像隐藏
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 图片隐藏文字头像显示
        $(".layui-nav-img").hide();
        var first = name[0];
        $(".text-avatar").html(first.toUpperCase()).show();
    }
}