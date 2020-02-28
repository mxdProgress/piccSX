layui.use(['form', 'layedit', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        $ = layui.jquery;
    var getLoginInfo = loginInfo();
    var urlPar = getParamsFromURL();
    var orgIds = getLoginInfo.orgId.substr(0, 11);

    treeFun('treetable', orgIds, 1);
    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    //监听提交
    form.on('submit(demo1)', function(data) {
        data.field.caseId = urlPar.caseId;
        data.field.registno = urlPar.registno;
        data.field.comCode = $("#orgId").attr("comCode");
        data.field.orgId = $("#orgId").attr("orgId");
        data.field.userId = getLoginInfo.userId;
        if (!data.field.orgId) {
            parent.layuimini.msg_success('请选择机构');
            return;
        }
        parent.layer.open({
            title: '提示',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 40px;">确认提交？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.updateCaseRepairCom, data.field, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.msg('操作成功');
                        setTimeout(function() {
                            //刷新
                            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                            //关闭
                            parent.layer.closeAll();
                        }, 1000);
                    }
                });
            }
        });
        return false;
    });
});