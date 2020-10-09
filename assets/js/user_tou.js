$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //   上传按钮点击事件
    $("#btnup").on("click", function () {
        //  模拟点击事件
        $("#file").click();
    })
    // 给文件选择框绑定change
    $("#file").on("change", function (e) {
        // 通过事件对象获得图片  伪数组
        var file = e.target.files;
        //  判断是否存在图片
        if (file.length === 0) {
            return layer.msg("请选择图片");
        }
        var file1 = e.target.files[0];
        var newImgURL = URL.createObjectURL(file1);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        
        // 为确认按钮绑定点击事件
        $("#btncu").on("click", function () {
            // 用户裁剪过后的头像
        var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            $.ajax({
                type: "POST",
                url: "/my/update/avatar",
                data: {
                    avatar: dataURL,
                },
                success: function (res) {
                    if (res.status != 0) return layer.msg(res.message)
                    layer.msg("上传成功");
                    // 获取服务器的数据
                    window.parent.getUserInfo();
                }

            })
        })
    })
})