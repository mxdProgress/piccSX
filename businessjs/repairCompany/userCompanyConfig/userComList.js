layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    // 初始化上级机构下拉框
    var loginInfo = getLoginInfo();
    getdgtree("orgId");

    function tableFun(st, et) {
        table.render({
            elem: '#tableId',
            url: serverconfig.baseurl + serverconfig.interface.queryUserFacRelation,
            method: "POST",
            headers: { token: cookie.get("token") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                searchValue: $("#searchValue").val(),
                userId: getLoginInfo.userId,
                orgId: $("#orgId").val(),
                factorycode: getLoginInfo.factorycode
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: pagesize,
            parseData: function(res) {
                return {
                    "code": 0,
                    "msg": res.info,
                    "count": res.count,
                    "data": res.list
                };
            },
            cols: [
                [
                    { type: 'radio', fixed: 'left' },
                    { field: 'realName', width: 100, title: '姓名', },
                    { field: 'userName', width: 100, title: '用户名' },
                    { field: 'orgName', title: '机构名称' },
                    { field: 'factoryName', title: '维修单位名称', },
                    { field: 'address', title: '维修单位地址' },
                ]
            ]
        });
    }
    tableFun();

    //删除关联信息
    $('.deleteBtn').on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        var arr = [];
        if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        }
        arr.push(checkStatus.data[0].id);
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除关联信息吗？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.userDeleteByIds, { ids: arr }, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.close(index);
                        parent.layuimini.msg_success('删除成功');
                        tableFun();
                    }
                });
            }
        });
    });
    //删除所有修理厂
    $('.deleteBtnFoctory').on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        }
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除所有关联维修单位吗？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.deleteRelByUserId, { userId: checkStatus.data[0].userId }, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.close(index);
                        parent.layuimini.msg_success('删除成功');
                        tableFun();
                    }
                });
            }
        });
    });


    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增关联",
            area: ['75%', '90%'],
            resize: false,
            move: false,
            content: '/piccSxHtml/repairCompany/userCompanyConfig/uesrCompanyAddForm.html',
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
        $("#orgId").val('');
        form.render();
        tableFun();
    });

});