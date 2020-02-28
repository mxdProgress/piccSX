layui.use(['form', 'layedit', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        $ = layui.jquery;
    var urlPar = getParamsFromURL();
    var pa = {
        funcId: urlPar.funcId
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
            parent.layer.closeAll();
        });
        return false;
    });
});