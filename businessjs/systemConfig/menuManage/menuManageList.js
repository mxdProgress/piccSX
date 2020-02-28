var par = {};
layui.use(['laypage', 'layer', 'laytpl', 'layuimini'], function() {
    var laypage = layui.laypage,
        layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.jquery;
    var AllPage;
    var par = getdefaultparam();
    par.isPage = "0";

    function search() {
        // 请求
        jqpost(serverconfig.interface.maintenanceGetMaintenanceTree, par, true, tplDate);
    }

    // 渲染模板
    function tplDate(data, status, xhr) {
        var getTpl = orgTpl.innerHTML;
        var pp = [];
        var da = data.detail;

        function dgtree(da) {
            var tp = da.funcId.split("_");
            for (var i = 1; i < tp.length; i++) {
                da.title = "&nbsp;&nbsp;&nbsp;&nbsp;" + da.title;
            }
            pp.push(da);
            if (da.childList != null) {
                for (var i = 0; i < da.childList.length; i++) {
                    dgtree(da.childList[i]);
                }
            }

        }
        dgtree(da);
        laytpl(getTpl).render(pp, function(html) {
            orgView.innerHTML = html;
            // 编辑
            $('.editBtn').on('click', function() {
                var obj = {
                    funcId: $(this).attr("funcId")
                }
                parent.layer.open({
                    type: 2,
                    title: "编辑功能菜单",
                    area: ['600px', '98%'],
                    resize: false,
                    move: false,
                    content: 'piccSxHtml/systemConfig/menuManage/menuManageEdit.html?' + getParam(obj),
                });
            });
            // 删除
            $('.delBtn').on('click', function() {
                var delId = $(this).attr("funcId");
                parent.layer.open({
                    title: '',
                    maxmin: false,
                    type: 1,
                    moveType: 0,
                    content: '<div style="padding: 20px 60px;">确认删除该信息吗？</div>',
                    btn: ['确定', '取消'],
                    yes: function(index) {
                        var pm = {};
                        pm.funcId = delId;
                        jqpost(serverconfig.interface.maintenanceDeleteMaintenance, pm, true, function(data) {
                            if (data.status == 1) {
                                parent.layer.close(index);
                                parent.layuimini.msg_success('删除成功！');
                                jqpost(serverconfig.interface.maintenanceGetMaintenanceTree, par, true, tplDate);
                            }
                        });
                    }
                });
            });

            $("#treetable").treetable({
                expandable: true
            });
        });
    }
    search();


    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增用户",
            area: ['600px', '98%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/menuManage/menuManageAdd.html',
        });
    });

});