layui.use(['form', 'layer', 'laytpl', 'table', 'layuimini'], function() {
    layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        table = layui.table,
        $ = layui.jquery;

    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增角色",
            area: ['650px', '90%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/organizationalRole/organizationalRoleListAddForm.html',
        });
    });

    function tableFun() {
        table.render({
            elem: '#demo',
            url: serverconfig.baseurl + serverconfig.interface.roleOrganRoleList,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
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
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
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
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }
    tableFun();


    table.on('tool(test)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "editBtn") {
            // layuimini.getTitleDelTab('编辑角色');
            // var time = new Date().getTime();
            // layui.data('time', {
            //     key: 'time',
            //     value: time
            // });
            // // 组织角色数据id
            // layui.data('organizationalRoleListEditForm', {
            //     key: 'organizationRoleId' + time,
            //     value: datas.organizationRoleId
            // });
            var obj = {
                organizationRoleId: datas.organizationRoleId
            }
            parent.layer.open({
                type: 2,
                title: "编辑角色",
                area: ['650px', '90%'],
                resize: false,
                move: false,
                content: 'piccSxHtml/systemConfig/organizationalRole/organizationalRoleListEditForm.html?' + getParam(obj),
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
            // layuimini.getTitleDelTab('分配用户');
            // var time = new Date().getTime();
            // layui.data('time', {
            //     key: 'time',
            //     value: time
            // });
            // // 组织角色数据id
            // layui.data('organizationalRoleListDistributionForm', {
            //     key: 'organizationRoleId' + time,
            //     value: datas.organizationRoleId
            // });
            var obj = {
                organizationRoleId: datas.organizationRoleId
            }
            parent.layer.open({
                type: 2,
                title: "分配用户",
                area: ['550px', '80%'],
                resize: false,
                move: false,
                content: 'piccSxHtml/systemConfig/organizationalRole/organizationalRoleListDistributionForm.html?' + getParam(obj),
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