layui.use(['form', 'layer', 'table'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        $ = layui.jquery;

    function tableFun() {
        table.render({
            elem: '#orgView',
            url: serverconfig.baseurl + serverconfig.interface.findUserListForRole,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                searchValue: $("#searchValue").val(),
                accountType: 2
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: pagesize,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
            },
            cols: [
                [
                    { field: 'userName', width: 150, title: '用户名' },
                    { field: 'realName', width: 150, title: '姓名', },
                    { field: 'orgNames', title: '归属单位', },
                    { field: 'phone', width: 150, title: '手机号' },
                    { field: 'right', width: 230, title: '操作', toolbar: '#barBtn', fixed: 'right' }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }
    tableFun();


    $('.add-btn').on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增用户",
            area: ['650px', '80%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/repairFoctoryManage/repairFoctoryManageAddForm.html',
        });
    });

    table.on('tool(orgView)', function(obj) {
        var event = obj.event;
        var datas = obj.data;

        if (event == "editBtn") {
            var obj = {
                userId: datas.userId,
                realName: datas.realName,
                phone: datas.phone,
                orgId: datas.orgId,
                orgNames: datas.orgNames,
                userName: datas.userName,
                passWord: datas.passWord,
            }
            parent.layer.open({
                type: 2,
                title: "编辑用户",
                area: ['650px', '80%'],
                resize: false,
                move: false,
                content: 'piccSxHtml/systemConfig/repairFoctoryManage/repairFoctoryManageEditForm.html?' + getParam(obj),
            });
        } else if (event == "deleteBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认删除该信息吗？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    jqpost(serverconfig.interface.userRemoveUser, { id: datas.userId }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('删除成功');
                            tableFun();
                        }
                    });
                }
            });
        } else if (event == "onlockBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认解锁？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    jqpost(serverconfig.interface.updateAccountStatus, { userId: datas.userId, accountStatus: "1" }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layer.msg('操作成功');
                            setTimeout(function() {
                                tableFun();
                            }, 1000);
                        }
                    });
                }
            });
        } else if (event == "lockBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认锁定？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    jqpost(serverconfig.interface.updateAccountStatus, { userId: datas.userId, accountStatus: "2" }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layer.msg('操作成功');
                            setTimeout(function() {
                                tableFun();
                            }, 1000);
                        }
                    });
                }
            });
        }
    });

    $("#importTemplate").on('click', function() {
        window.open(serverconfig.baseurl + serverconfig.interface.exportFacUserTemplate);
    })

    $("#importRepairs").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "导入Excel模板",
            area: ['30%', '50%'],
            resize: false,
            move: false,
            content: '/piccSxHtml/systemConfig/repairFoctoryManage/repairFoctoryManageImport.html',
        });
    });


    // 查询
    $('.search-btn').on('click', function() {
        tableFun();
    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() { //给输入框绑定按键事件
        if (event.keyCode == "13") { //判断如果按下的是回车键则执行下面的代码
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#searchValue").val('');
        tableFun();
    });

});