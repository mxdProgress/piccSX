layui.use(['form', 'layer', 'laytpl', 'table', 'layuimini'], function() {
    layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        table = layui.table,
        $ = layui.jquery;
    var nowCurr = 1;

    // checkPagePermissions($);

    function tableFun() {
        table.render({
            elem: '#demo',
            url: serverconfig.baseurl + serverconfig.interface.roleOrganRoleList,
            method: "POST",
            headers: { token: cookie.get("token") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                searchValue: $("#searchValue").val()
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
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
                    { field: 'orgName', title: '归属机构', },
                    { field: 'organizationRoleName', title: '名称', },
                    { field: 'organizationRoleCode', title: '编码', },
                    { field: 'organizationEnableDesc', title: '是否启用' },
                    { field: 'organizationMark', title: '备注' },
                    { field: 'right', width: 250, title: '操作', toolbar: '#barDemo' }
                ]
            ]
        });
    }
    tableFun();


    table.on('tool(test)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "editBtn") {
            layuimini.getTitleDelTab('编辑角色');
            var time = new Date().getTime();
            layui.data('time', {
                key: 'time',
                value: time
            });
            // 组织角色数据id
            layui.data('organizationalRoleListEditForm', {
                key: 'organizationRoleId' + time,
                value: datas.organizationRoleId
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
                    jqpost(serverconfig.interface.roleOrganRoleDeleteOrganRole, { organizationRoleId: datas.organizationRoleId }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('删除成功');
                            tableFun();
                        }
                    });
                }
            });
        } else if (event == "selectuserBtn") {
            layuimini.getTitleDelTab('分配用户');
            var time = new Date().getTime();
            layui.data('time', {
                key: 'time',
                value: time
            });
            // 组织角色数据id
            layui.data('organizationalRoleListDistributionForm', {
                key: 'organizationRoleId' + time,
                value: datas.organizationRoleId
            });
        }
    });


    // 查询
    $('.search-btn').on('click', function() {
        tableFun();
    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() {
        if (event.keyCode == "13") {
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#searchValue").val("");
        tableFun();
    });

});