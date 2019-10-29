layui.use(['form', 'layer', 'laytpl', 'table', 'layuimini', 'laydate'], function() {
    layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var date = getDate();
    var LoginInfo = getLoginInfo();

    laydate.render({
        elem: '#startTime',
        type: 'datetime'
    });

    laydate.render({
        elem: '#endTime',
        type: 'datetime'
    });

    $("#startTime").val(date + ' 00:00:00');
    $("#endTime").val(date + ' 23:59:59');

    function tableFun() {
        table.render({
            elem: '#table',
            url: serverconfig.baseurl + serverconfig.interface.queryProblem,
            method: "POST",
            headers: { token: cookie.get("token") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                phone: $("#searchValue").val(),
                accountType: $("#accountType").val(),
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                solveStatus: $("#solveDesc").val()

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
                    { field: 'accountTypeDesc', title: '用户类型', },
                    { field: 'phone', title: '电话', },
                    { field: 'createTime', title: '反馈时间', },
                    { field: 'solveStatusDesc', title: '处理状态描述' },
                    { field: 'solveDesc', title: '处理描述' },
                    { field: 'problemDesc', title: '问题描述' },
                    { field: 'right', width: 200, title: '操作', toolbar: '#barDemo' }
                ]
            ]
        });
    }
    tableFun();


    table.on('tool(table)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "editBtn") {
            parent.layer.open({
                type: 2,
                title: "编辑反馈状态",
                area: ['40%', '50%'],
                resize: false,
                move: false,
                content: '/piccSxHtml/systemConfig/problemFeedBack/problemFeedBackEdit.html?' + getParam({ id: datas.id }),
            });
        } else if (event == "deleteBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认删除吗？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    jqpost(serverconfig.interface.deleteProblem, { ids: [datas.id] }, true, function(data) {
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
    $('#searchValue').keydown(function() {
        if (event.keyCode == "13") {
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#searchValue").val("");
        $("#startTime").val('');
        $("#endTime").val('');
        $("#solveDesc").val('');
        $("#accountType").val('');
        form.render();
        tableFun();
    });

});