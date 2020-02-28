layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var loginInfo = getLoginInfo();

    treeFun('treetable', loginInfo.orgId, 1);
    // setTimeout(function() {
    //     treeFun('treetable1', loginInfo.orgId, 1);
    // }, 1000)
    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    function tableFun() {
        var pa = {
            isPage: "1",
            queryCondition: $("#queryCondition").val(),
            comCode: $("#userOrgRelation").attr('comCode') ? $("#userOrgRelation").attr('comCode') : '',
            orgId: $("#userOrg").attr('orgId') ? $("#userOrg").attr('orgId') : loginInfo.orgId
        }
        var cols = [
            { type: 'checkbox', fixed: 'left' },
            { field: 'comCode', title: '片区机构码' },
            { field: 'userName', title: '工号' },
            { field: 'realName', title: '姓名' },
            { field: 'orgName', title: '片区名称' },
            // { field: 'right', width: 200, title: '操作', toolbar: '#barBtn', fixed: 'right' }
        ]
        tablePost('#caseInfomation', serverconfig.interface.queryUserOrgRelation, true, pa, cols);

    }
    tableFun();


    $(".deleteInfo").on('click', function() {
        var ids = [];
        var checks = table.checkStatus('caseInfomation');
        var checksArray = checks.data;
        if (checksArray.length == 0) {
            parent.layuimini.msg_error('请选择要删除的信息!');
            return;
        } else {
            for (var i = 0; i < checksArray.length; i++) {
                ids.push(checksArray[i].id);
            }
        }
        var par = {
            "ids": ids,
        };
        parent.layer.open({
            title: '提示',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除关联信息？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.userRelationdeleteByIds, par, true, function(data) {
                    if (data.status == 1) {
                        parent.layuimini.msg_success('操作成功！');
                        tableFun();
                        setTimeout(function() {
                            parent.layer.close(index);
                        }, 1000)
                    }
                });
            }
        });
    })

    // table.on('tool(caseInfomation)', function(obj) {
    //     var event = obj.event;
    //     var datas = obj.data;
    //     if (event == "deleteInfo") {
    //         parent.layer.open({
    //             title: '提示',
    //             maxmin: false,
    //             type: 1,
    //             moveType: 0,
    //             content: '<div style="padding: 20px 60px;">确认删除关联信息？</div>',
    //             btn: ['确定', '取消'],
    //             yes: function(index) {
    //                 var par = {
    //                     "ids": [datas.id],
    //                 };
    //                 jqpost(serverconfig.interface.userRelationdeleteByIds, par, true, function(data) {
    //                     if (data.status == 1) {
    //                         parent.layuimini.msg_success('操作成功！');
    //                         tableFun();
    //                         setTimeout(function() {
    //                             parent.layer.close(index);
    //                         }, 1000)
    //                     }
    //                 });
    //             }
    //         });

    //     } else if (event == 'deleteInfoRelation') {
    //         parent.layer.open({
    //             title: '提示',
    //             maxmin: false,
    //             type: 1,
    //             moveType: 0,
    //             content: '<div style="padding: 20px 60px;">确认删除所有片区关联？</div>',
    //             btn: ['确定', '取消'],
    //             yes: function(index) {
    //                 var par = {
    //                     "userId": datas.userId,
    //                 };
    //                 jqpost(serverconfig.interface.deleteRelByUserIds, par, true, function(data) {
    //                     if (data.status == 1) {
    //                         parent.layuimini.msg_success('操作成功！');
    //                         tableFun();
    //                         setTimeout(function() {
    //                             parent.layer.close(index);
    //                         }, 1000)
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });


    $(".addOrgRelation").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "人员片区关联",
            area: ['95%', '98%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/userOrgRelationConfig/userOrgRelationManage/adduserOrgRelationForm.html'
        });
    });
    // 查询
    $('.search-btn').on('click', function() {
        $(".orgIdBox").hide();
        tableFun();
    });

    //回车
    enterKey(".search-btn");

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $(".orgIdBox").hide();
        $("#queryCondition").val('');
        $("#userOrg").val('');
        $("#userOrgRelation").val('');
        $("#userOrgRelation").attr('comCode', '');
        $("#userOrg").attr('orgId', '');
        form.render();
        tableFun();
    });

});