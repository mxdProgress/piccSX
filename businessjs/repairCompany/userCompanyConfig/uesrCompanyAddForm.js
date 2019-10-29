layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var getLoginInfo = loginInfo();
    getdgtree("orgId");

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
                form.render();
            }
        });
    }
    repairComFun();

    function tableFun() {
        table.render({
            elem: '#tableId',
            url: serverconfig.baseurl + serverconfig.interface.queryUserByCommonRole,
            method: "POST",
            headers: { token: cookie.get("token") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                orgId: $("#orgId").val(),
                queryType: $("#roleType").val()
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
                    { field: 'realName', title: '姓名', },
                    { field: 'userName', title: '用户名' },
                    { field: 'orgName', title: '机构名称' },
                ]
            ]
        });
    }
    tableFun();
    $("#submitBtn").on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        var factoryCode = $("#repairCompany").val();
        var arrFactory = [];
        arrFactory.push(factoryCode);
        if (!factoryCode) {
            layuimini.msg_error('请选择维修单位');
            return;
        } else if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        };
        var pa = {
            userId: checkStatus.data[0].userId,
            factorycodes: arrFactory
        };
        jqpost(serverconfig.interface.addUserFacRelation, pa, true, function(data, status, xhr) {
            if (data.status == 1) {
                layuimini.msg_success('关联成功');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            }

        });
    });
    table.on('tool(tableId)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "deleteBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认删除吗？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var arr = [];
                    arr.push(datas.id);
                    jqpost(serverconfig.interface.userDeleteByIds, { ids: arr }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('删除成功');
                            tableFun();
                        }
                    });
                }
            });
        }
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
        $("#orgId").val('');
        $("#roleType").val('');
        form.render();
        tableFun();
    });
})