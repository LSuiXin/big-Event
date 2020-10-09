$(function () {
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        ,
        // 新与旧
        sepwd: function (value) {
            if (value == $("[name=oldPwd]").val()) {
                return "新密码不能和旧密码相同"
            }
        },
        // 确认密码
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一样"
            }
        }
    })
     var layer = layui.layer;
    // 
    $(".layui-form").on("submit",function(e){
        // 阻止表单的默认提交行为
         e.preventDefault();
        //  $('.layui-form')[0].reset();
       
         $.ajax({
             type:"POST",
             url:"/my/updatepwd",
             data:$(this).serialize(),
             success:function(res){
                 if (res.status != 0) return layer.msg(res.message);
                 layer.msg(res.message)
              
                // 两秒后跳转
                // setTimeout(function(){
                //   window.parent.location.href = "/login.html";
                // },2000)
             }
         })
    })
})