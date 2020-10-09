$(function () {
    var layer = layui.layer;
    // 获取文章列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
           type:"get",
           url:"/my/article/cates",
           success:function(res){
            //    console.log(res);
             var htmlstr = template("tem",res);
             $(".layui-table tbody").html(htmlstr);
           }
        })
    }
    var close = null;
    // 点击弹出窗口
    $("#addbtn").on("click",function(){
        // 返回的索引   根据索引关闭窗口
      close = layer.open({
            type:1,
            title: '添加文章类别',
            area:["500px","200px"],
            content: $("#add").html(),
        })
    })
    // 因为弹层是后添加的，所以当提交数据时要给页面固有的标签添加事件委托
   $("body").on("submit","#add_list",function(e){
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type:"POST",
            url:"/my/article/addcates",
            //快速获得表单数据
            data:$(this).serialize(),
            success:function(res){
            if (res.status != 0) return layer.msg(res.message);
            layer.msg(res.message);
            // 关闭窗口
            layer.close(close);
            // 重新渲染页面
            initArtCateList();
            }
        })
        
   })
})