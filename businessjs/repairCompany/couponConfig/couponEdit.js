layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var getLoginInfo = loginInfo();
    var getUrlObj = getParamsFromURL();
    getUrlObj.startTime = getUrlObj.startDay;
    getUrlObj.endTime = getUrlObj.endDay;

    laydate.render({
        elem: '#startTime'
    });

    laydate.render({
        elem: '#endTime'
    });

    function repairComFun() {
        var pa = {};
        if (getLoginInfo.comCode) {
            pa.comcode = getLoginInfo.comCode;
        } else {
            pa.queryCondition = getLoginInfo.orgName;
        }
        jqpost(serverconfig.interface.queryFactoryInfo, pa, true, function(data, status, xhr) {
            var daObj = data.list;
            if (daObj) {
                for (var i = 0; i < daObj.length; i++) {
                    $("#repairCompany").append("<option value='" + daObj[i].factorycode + "' >" + daObj[i].factoryname + "</option>");
                };
                loadJsonDataToForm(getUrlObj);

                form.render();
            }
        });
    }
    repairComFun();

    form.on('submit(formDemo)', function(data) {
        data.field.id = getUrlObj.id;
        data.field.creatorId = getLoginInfo.userId;
        data.field.factorycode = getLoginInfo.factorycode;
        data.field.startTime = $("#startTime").val() + ' 00:00:00';
        data.field.endTime = $("#endTime").val() + ' 23:59:59';
        jqpost(serverconfig.interface.updateCouponInfo, data.field, true, function(data) {
            if (data.status == 1) {
                parent.layuimini.msg_success('操作成功');

                setTimeout(function() {
                    //跳转
                    layuimini.getChangeTab('优惠券配置');
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