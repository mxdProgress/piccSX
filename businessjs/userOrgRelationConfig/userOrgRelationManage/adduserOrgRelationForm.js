layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        $ = layui.jquery;
    var loginInfo = getLoginInfo();
    _height = $(window).height();
    $(".userLeft,.userRight").css('height', _height - 130);

    treeFun('treetable', loginInfo.orgId, 1);
    setTimeout(function() {
        treeFun('treetable1', loginInfo.orgId, 1);
    }, 1000)
    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    function tableFun() {
        var pa = {
            isPage: "1",
            orgId: $("#userOrg").attr('orgId'),
            searchValue: $("#queryCondition").val()
        }
        var cols = [
            { type: 'radio', fixed: 'left' },
            { field: 'userName', title: '用户名' },
            { field: 'realName', title: '姓名', },
            { field: 'phone', title: '手机号' },
        ]
        tablePost('#caseInfomation', serverconfig.interface.findUserList, false, pa, cols);
    }
    tableFun();

    function tableFun1() {
        var par = {
            isPage: "1",
            levelFlag: 3,
            orgId: $("#userOrgRelation").attr('orgId') ? $("#userOrgRelation").attr('orgId') : loginInfo.orgId,
            orgType: 1
        }
        var cols = [
            { type: 'checkbox', fixed: 'left' },
            { field: 'orgName', title: '机构名称' },
            { field: 'simpleName', title: '机构简称' },
            { field: 'comCode', title: '机构编码', }
        ]
        tablePost('#orgList', serverconfig.interface.getOrgList, false, par, cols);
    }
    tableFun1();

    $(".submit").on('click', function() {
        var orgListStatus = table.checkStatus('orgList');
        var userListStatus = table.checkStatus('caseInfomation');
        var orgListStatusArray = orgListStatus.data;
        var userListStatusArray = userListStatus.data;
        var pqorgIds = [];
        var userId;


        if (userListStatusArray.length == 0) {
            parent.layuimini.msg_error('请选择要关联的人员');
            return;
        } else {
            userId = userListStatusArray[0].userId;
        }


        if (orgListStatusArray.length == 0) {
            parent.layuimini.msg_error('请选择要关联的片区');
            return;
        } else {
            for (var i = 0; i < orgListStatusArray.length; i++) {
                pqorgIds.push(orgListStatusArray[i].orgId);
            }
        }
        var obj = {
            userId: userId,
            orgIds: pqorgIds
        }
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认关联？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.addUserOrgRelation, obj, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.close(index);
                        parent.layuimini.msg_success('操作成功');
                        $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                        tableFun();
                        tableFun1();
                    }
                });
            }
        });

    })


    $('.search-btn').on('click', function() {
        $(".orgIdBox").hide();
        tableFun();
    });
    $('.clear-btn').on('click', function() {
        $(".orgIdBox").hide();
        $("#userOrg").val('');
        $("#queryCondition").val('');
        $("#userOrg").attr('orgId', '');
        form.render();
        tableFun();
    });

    $('.search-btn1').on('click', function() {
        $(".orgIdBox").hide();
        tableFun1();
    });
    $('.clear-btn1').on('click', function() {
        $(".orgIdBox").hide();
        $("#userOrgRelation").val('');
        $("#userOrgRelation").attr('orgId', '');
        form.render();
        tableFun1();
    });

});