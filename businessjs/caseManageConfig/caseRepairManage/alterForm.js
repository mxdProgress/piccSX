layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var date = getDate();
    var LoginInfo = getLoginInfo();
    var url = getParamsFromURL();

    //修理厂
    function repairComFun() {
        var pa = {};
        if (LoginInfo.comCode) {
            pa.comcode = LoginInfo.comCode;
        }
        jqpost(serverconfig.interface.queryFactoryInfo, pa, true, function(data, status, xhr) {
            var daObj = data.list;
            if (daObj) {
                for (var i = 0; i < daObj.length; i++) {
                    $("#repairCompany").append("<option value='" + daObj[i].factorycode + "'factoryname='" + daObj[i].factoryname + "' comCode='" + daObj[i].comcode + "'>" + daObj[i].factoryname + "</option>");
                };
                $("#lossReason").val(url.lossReason);
                $("#repairCompany").val(url.factorycode);
                $("#remark").val(url.otherDesc);
                form.render();
            }
        });
    }
    repairComFun();


    function lossInfoDictionary() {
        jqpost(serverconfig.interface.queryLossDic, {}, true, function(data) {
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var html = "";
                html += "<li>";
                html += list[i];
                html += "</li>";
                $(".lossList ul").append(html);
            }
            $(".lossList ul li").on("click", function() {
                var text = $(this).text();
                $(".lossReason").val(text);
                $(".lossList").hide();
            })
        });
    }
    lossInfoDictionary();

    $(".lossReason").on('click', function() {
        $(".lossList").slideToggle(50);
    });

    //修改提交
    form.on('submit(alterSubmit)', function(data) {
        parent.layer.open({
            title: '提示',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认修改流失信息?</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                data.field.caseId = url.id;
                data.field.userId = url.userId;
                data.field.factoryName = $("#repairCompany option:selected").attr('factoryname');

                if (data.field.factoryName == undefined) {
                    data.field.factoryName = "";
                }
                jqpost(serverconfig.interface.updateLossInfo, data.field, true, function(data) {
                    if (data.status == 1) {
                        $(".layui-btn-primary").click();
                        parent.layer.closeAll();
                        parent.layuimini.msg_success('操作成功');
                        $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();

                    }
                });

            }
        });
        return false;
    });



});