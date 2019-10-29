layui.use(['form', 'layer'], function() {
    var layer = layui.layer,
        form = layui.form,
        urlObj = getParamsFromURL(),
        id = urlObj.id;

    form.on('submit(formSubmit)', function(data) {
        data.field.id = id;
        jqpost(serverconfig.interface.updateProblem, data.field, true, function(data) {
            if (data.status == 1) {
                parent.layuimini.msg_success('操作成功');
                setTimeout(function() {
                    //跳转
                    layuimini.getChangeTab('问题反馈');
                    //刷新
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                    //关闭
                    parent.layer.closeAll();
                }, 1000);
            }
        });
        return false;
    });



});