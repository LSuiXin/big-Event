$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                //    console.log(res);
                var htmlstr = template("tem", res);
                $(".layui-table tbody").html(htmlstr);
            }
        })
    }
    var close = null;
    // 点击弹出窗口
    $("#addbtn").on("click", function () {
        // 返回的索引   根据索引关闭窗口
        close = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ["500px", "200px"],
            content: $("#add").html(),
        })
    })
    // 因为弹层是后添加的，所以当提交数据时要给页面固有的标签添加事件委托
    $("body").on("submit", "#add_list", function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            //快速获得表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 关闭窗口
                layer.close(close);
                // 重新渲染页面
                initArtCateList();
            }
        })

    })
    var indexAdd = null
    //点击编辑按钮弹出编辑窗口
    $("body").on("click", "#btn-add", function () {
        indexAdd = layer.open({
            type: 1,
            title: '编辑文章',
            area: ["500px", "200px"],
            content: $("#btn-edit").html(),
        })
        var idx = $(this).attr("data-id");
        // console.log(idx);
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + idx,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // 快速填充服务器返回来的值  使用form。val方法前题必须要有lay-filter属性
                form.val("form-edit", res.data);

            }
        })
    })
    // 为修改分类绑定提交事件
    $("body").on("submit", "#form-edit", function (e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 快速获得表单数据
        var data = $("#form-edit").serialize();
        console.log(data);
        // 调用接口请求数据将数据提交上去
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: data,
            success: function (res) {
                //判断是否请求成功
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 关闭窗口
                layer.close(indexAdd);
                // 重新渲染页面
                initArtCateList();
            }
        })
    })
    // 给删除按钮添加事件 因为是动态添加按钮的所以也要使用事件委托
    $("tbody").on("click", "#btn-del", function () {
        //通过自定义属性获得删除数据的id
        var id = $(this).siblings("#btn-add").attr("data-id");
        // var id= $(this).attr("data-id");
        console.log(id);
        // 使用layer。confirm弹出询问框
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function (index) {
            // 向服务器发送请求
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status != 0) return layer.msg(res.message);
                    layer.msg(res.message);
                    // 重新渲染页面
                    initArtCateList();

                }
            })
            layer.close(index);
        });


    })
})