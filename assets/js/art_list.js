$(function () {
    // 方便使用  请求参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: "",//文章分类的 Id
        state: "",//文章的状态，可选值有：已发布、草稿
    }
    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const time = new Date(data);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();

        var h = time.getHours();
        // 补零操作
        h = h < 10 ? "0" + h : h;
        var mm = time.getMinutes();
        mm = mm < 10 ? "0" + mm : mm;
        var s = time.getSeconds();
        s = s < 10 ? "0" + s : s;

        // 必须return出去
        return y + "-" + m + "-" + d + "  " + h + ":" + mm + ":" + s;
    }

    var layer = layui.layer;
    var form = layui.form;
    initTable();
    initSel();

    // 初始化表格 获取文章数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // layer.msg(res.message);
                // 使用模板引擎导入数据
                var htmStr = template("tbod", res);
                $("tbody").html(htmStr);
                // 渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 初始化列表 获取文章分类列表
    function initSel() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message)
                // layer.msg(res.message);
                // 使用模板引擎
                var htmStr = template("sel", res);
                // console.log(htmStr);
                $("#Sel").html(htmStr);

                form.render();
            }
        })
    }

    // 筛选功能
    $("#list").on("submit", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        //获取表单中的值 并赋值到请求参数上
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name = state]").val();
        // 重新加载页面
        initTable();
    })
    var indexEdit = null;
    // 修改功能 因为时动态添加的所以要进行事件委托
    $("tbody").on("click", "#btnup", function (e) {

        //  e.preventDefault();
        // 获取当前的id
        var id = $(this).attr("data-id");
        //点击弹出询问框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#add-up').html()
        })
        // 快速填充数据
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message)
                // console.log(res.data);
                // 快速填充服务器返回来的值  使用form。val方法前题必须要有lay-filter属性
                form.val("form-edit", res.data);
            }
        })
        // 下拉框的填充
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                // layer.msg(res.message);
                // 使用模板引擎导入数据模板引擎
                var htmStr = template("sel", res);
                // console.log(htmStr);
                $("[name=cate_name]").html(htmStr);
                form.render();
            }
        })

    })
    // 确认修改功能
    $("body").on("submit","#form-edit",function(e){
        // 阻止默认行为
         e.preventDefault();
         console.log(123);
    })
    // 删除功能
    $("tbody").on("click", "#btn-del", function () {
        // 获取当前数据的索引值
        var id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    // 判断当前页面是否有剩余数据  this指删除按钮
                    if($(this).length === 1){
                        // 当前页码等于1时 证明当前页码为1 不能再减了 否则减1 将最新的页码指给q.pagenum
                        q.pagenum =q.pagenum ==1? 1 : q.pagenum -1;
                    }
                    initTable();
                }
            })
        })
    })

    // 分页模块
    var laypage = layui.laypage;
    function renderPage(total) {
        // 调用方法渲染分页
        laypage.render({
            elem: 'fenye', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//一页多少数据
            curr: q.pagenum,//默认选择第几页
            layout:["count","prev","limit","page","next","skip"],
            limits:[1,2,3],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
               // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码之给q.pagenum
                q.pagenum = obj.curr;
                // 切换条目时将最新的条目给请求参数
                q.pagesize = obj.limit;
                //首次不执行
                if(!first){
                  //do something
                  initTable()
                }
              }
        });

    }
})