layui.use(['form', 'layedit', 'laydate', 'layuimini', 'element'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        element = layui.element,
        $ = layui.jquery;


    // 初始化上级机构下拉框
    getgonggongtree(serverconfig.interface.maintenanceGetMaintenanceTree, null, "parentFuncCode", "funcId", "title");

    //自定义验证规则
    form.verify(formvalidator);

    //监听提交
    form.on('submit(demo1)', function(data) {
        layuimini.changeTab('piccSxHtml/systemConfig/menuManage/menuManageList.html?mpi=m-p-i-1');
        jqpost(serverconfig.interface.maintenanceSaveMaintenance, data.field, true, function() {
            layer.msg('操作成功');
            //跳转
            layuimini.getChangeTab('菜单管理');
            //刷新
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            //关闭
            layuimini.getTitleDelTab('新增功能菜单');
            $("#czBtn").click();
        });

        return false;
    });
});