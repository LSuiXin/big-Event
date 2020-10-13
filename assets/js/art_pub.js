$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 加载文章分类
    function initCate() {
        // 发送ajax请求
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // layer.msg(res.message);
                var html = template("sel", res);
                $("[name=cate_id]").html(html);
                //   因为是动态添加所以要是由render方法
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 选择封面
    $("#fengmian").on("click", function () {
        // console.log(123);
        // console.log($("#upFile"));
        $("#upFile").click();
    })
    // 监听上传的change时间
    $("#upFile").on("change", function (e) {
        var files = e.target.files
        // console.log(files);
        if (files.length === 0) {
            return layer.msg("请选择图片");
        }
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 发布文章
    var art_state = "已发布";
    $("#caogao").on("click", function () {
        art_state = "草稿";
    })
    // 为表单监听submit事件
    $("#form_pub").on("submit", function (e) {
        e.preventDefault();

        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                 // 发起ajax请求
                publishArticle(fd);
            }) 
    })
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 使用FormData必要的配置项
            contentType:false,
            processData:false,
            success:function(res){
                 if (res.status != 0) return layer.msg(res.message);
                 layer.msg(res.message);
                 location.href = "/article/art_list.html"

            }
            
        })
    }

})