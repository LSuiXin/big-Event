$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度在1-6个字符之间"
            }
        }
    })

    initUserInfo();
    // 获取用户信息
    function initUserInfo() {
        // 调用接口请求数据
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // 调用form.val()快速为表单赋值
                form.val("formUserInfo", res.data);
            }

        })
    }
    // 重置表单数据
    $("#reset").on("click", function (e) {
        // 阻止默认的重置行为
        e.preventDefault();
        // 重新渲染页面
        initUserInfo();
    })
    // 更新数据
    $(".layui-form").on("submit",function(e){
         e.preventDefault();
        //  发起请求
        $.ajax({
            type:"POST",
            url:"/my/userinfo",
            // serialize()快速获取表单信息 将用户信息提交给服务器
            data:$(this).serialize(),
            success:function(res){
                console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 调用父页面的方法，重新渲染头像和昵称
                window.parent.getUserInfo();
            }

        })
    })

})
