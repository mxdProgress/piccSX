layui.use(['form', 'layedit', 'laydate', 'element', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.jquery;

    var editFuncId = layui.data('menuManagementListEditForm');
    var time = layui.data('time')['time'];
    var orgId = editFuncId['funcId' + time];
    pa = {
        "funcId": orgId
    };

    jqpost(serverconfig.interface.maintenanceSelectMaintenance, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        layui.form.render();
    });

    //自定义验证规则
    form.verify(formvalidator);
    //监听提交
    form.on('submit(demo1)', function(data) {
        jqpost(serverconfig.interface.maintenanceUpdateMaintenance, data.field, true, function() {
            //跳转
            layuimini.getChangeTab('菜单管理');
            //刷新
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            //关闭
            layuimini.getTitleDelTab('编辑功能菜单');
        });
        return false;
    });
});