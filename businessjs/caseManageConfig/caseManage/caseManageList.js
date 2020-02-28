layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
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
            elem: '#caseInfomation',
            url: serverconfig.baseurl + serverconfig.interface.caseQueryCaseList,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                thirdflag: $("#thirdflag").val(),
                queryCondition: $("#queryCondition").val(),
                webQryStatus: $("#webQryStatus").val(),
                comCode: LoginInfo.comCode,
                factorycode: LoginInfo.factorycode,
                listOrDetail: 1
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
                    { field: 'registno', width: 220, title: '案件号', fixed: 'left' },
                    { field: 'factoryName', width: 130, title: '维修单位名称', },
                    { field: 'reportorname', width: 80, title: '报案人', },
                    { field: 'reportorphone', width: 110, title: '报案人电话' },
                    { field: 'reporttime', title: '报案时间' },
                    { field: 'reportaddress', title: '报案地址' },
                    { field: 'registcomcode', width: 100, title: '归属机构码' },
                    // { field: 'brandname', width: 100, title: '品牌名称' },
                    { field: 'repairStatusDesc', width: 100, title: '送修状态' },
                    { field: 'right', width: 110, title: '操作', toolbar: '#barBtn', fixed: 'right' }
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


    table.on('tool(caseInfomation)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "detailBtn") {
            layuimini.getTitleDelTab('案件详情');
            var time = new Date().getTime();
            layui.data('time', {
                key: 'time',
                value: time
            })
            layui.data('caseInformation', {
                key: 'id' + time,
                value: datas.id
            });
        }
    });

    // 查询
    $('.search-btn').on('click', function() {
        if (!$("#startTime").val() || !$("#endTime").val()) {
            layuimini.msg_error('请输入完整开始或结束日期');
            return;
        }
        tableFun();
    });

    //回车
    $('#searchValue').keydown(function() {
        if (event.keyCode == "13") {
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#startTime").val('');
        $("#endTime").val('');
        $("#queryCondition").val('');
        $("#thirdflag").val('');
        $("#webQryStatus").val('');
        form.render();
        tableFun();
    });

});