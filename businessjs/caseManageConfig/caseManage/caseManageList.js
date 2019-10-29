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
            headers: { token: cookie.get("token") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                thirdflag: $("#thirdflag").val(),
                queryCondition: $("#queryCondition").val(),
                webQryStatus: $("#webQryStatus").val(),
                comCode: LoginInfo.comCode,
                factorycode: LoginInfo.factorycode
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
                    { field: 'registno', width: 220, title: '案件号', fixed: 'left' },
                    { field: 'factoryName', width: 150, title: '维修单位名称', },
                    { field: 'reportorname', width: 100, title: '报案人', },
                    { field: 'reportorphone', width: 120, title: '报案人电话' },
                    { field: 'reporttime', title: '报案时间' },
                    { field: 'reportaddress', title: '报案地址' },
                    { field: 'registcomcode', width: 130, title: '归属机构码' },
                    // { field: 'payflagDesc', title: '是否赔付' },
                    { field: 'brandname', title: '品牌名称' },
                    { field: 'repairStatusDesc', title: '送修状态' },
                    // { field: 'arriveStatusDesc', title: '是否到店' },
                    // { field: 'evaluateStatusDesc', title: '是否评价' },
                    // { field: 'deliverStatusDesc', title: '是否交车' },
                    { field: 'right', width: 110, title: '操作', toolbar: '#barBtn', fixed: 'right' }
                ]
            ]
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
                key: 'registno' + time,
                value: datas.registno
            });
            layui.data('caseInformation', {
                key: 'factoryName' + time,
                value: datas.factoryName
            });
            layui.data('caseInformation', {
                key: 'reportorname' + time,
                value: datas.reportorname
            });
            layui.data('caseInformation', {
                key: 'reportorphone' + time,
                value: datas.reportorphone
            });
            layui.data('caseInformation', {
                key: 'reporttime' + time,
                value: datas.reporttime
            });
            layui.data('caseInformation', {
                key: 'reportaddress' + time,
                value: datas.reportaddress
            });
            layui.data('caseInformation', {
                key: 'registcomcode' + time,
                value: datas.registcomcode
            });
            layui.data('caseInformation', {
                key: 'payflagDesc' + time,
                value: datas.payflagDesc
            });

            layui.data('caseInformation', {
                key: 'brandname' + time,
                value: datas.brandname
            });
            layui.data('caseInformation', {
                key: 'repairStatusDesc' + time,
                value: datas.repairStatusDesc
            });
            layui.data('caseInformation', {
                key: 'arriveStatusDesc' + time,
                value: datas.arriveStatusDesc
            });
            layui.data('caseInformation', {
                key: 'evaluateStatusDesc' + time,
                value: datas.evaluateStatusDesc
            });
            layui.data('caseInformation', {
                key: 'deliverStatusDesc' + time,
                value: datas.deliverStatusDesc
            });
            layui.data('caseInformation', {
                key: 'licenseno' + time,
                value: datas.licenseno
            });
            layui.data('caseInformation', {
                key: 'thirdflag' + time,
                value: datas.thirdflag
            });
            layui.data('caseInformation', {
                key: 'id' + time,
                value: datas.id
            });
            layui.data('caseInformation', {
                key: 'repairStatus' + time,
                value: datas.repairStatus
            });

        }
    });

    // 查询
    $('.search-btn').on('click', function() {
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