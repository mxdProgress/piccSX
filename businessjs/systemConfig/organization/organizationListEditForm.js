layui.use(['form', 'layedit', 'laydate', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    var organizationListEditForm = layui.data('organizationListEditForm');
    var time = layui.data('time')['time'];
    var orgId = organizationListEditForm['orgId' + time];
    var pa = { orgId: orgId };

    // 初始化上级机构下拉框
    // getdgtree("parentOrgId");
    jqpost(serverconfig.interface.orgSelectOrg, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        layui.form.render();
    });

    //自定义验证规则
    form.verify(formvalidator);

    //监听提交
    form.on('submit(demo1)', function(data) {
        jqpost(serverconfig.interface.orgUpdateOrg, data.field, true, function(data) {
            parent.layuimini.msg_success('操作成功');
            $("#czBtn").click();

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('组织机构');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                layuimini.getTitleDelTab('编辑机构');
            }, 1000);
        });

        return false;
    });
});