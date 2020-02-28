layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var date = getDate();
    var loginInfo = getLoginInfo();

    laydate.render({
        elem: '#startTime',
        type: 'datetime'
    });

    laydate.render({
        elem: '#endTime',
        type: 'datetime'
    });

    $("#startTime").val(date + " 00:00:00");
    $("#endTime").val(date + " 23:59:59");

    /**树展示**/
    treeFun('treetable', loginInfo.orgId, 1);
    setTimeout(function() {
        treeFun('treetable1', loginInfo.orgId, 1);
    }, 1000)


    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    function tableFun() {
        table.render({
            elem: '#caseInfomation',
            url: serverconfig.baseurl + serverconfig.interface.queryDetailedList,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                queryCondition: $("#queryCondition").val(),
                comCode: $("#surveyAdd").attr('comCode') ? $("#surveyAdd").attr('comCode') : loginInfo.comCode,
                policycomcode: $("#policyAdd").attr('policycomcode') ? $("#policyAdd").attr('policycomcode') : loginInfo.comCode
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
                    { field: 'licenseno', width: 100, title: '车牌号' },
                    { field: 'reporttime', title: '报案时间' },
                    { field: 'reportorname', width: 110, title: '报案人姓名' },
                    { field: 'reportorphone', title: '报案人手机号' },
                    { field: 'resourceflagDesc', title: '资源类型' },
                    { field: 'reportaddress', title: '出险地址' },
                    { field: 'thirdflagDesc', width: 100, title: '是否三者车' },
                    { field: 'arriveStatusDesc', width: 100, title: '送修状态' },
                    { field: 'right', width: 100, title: '操作', toolbar: '#barBtn', fixed: 'right' }
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
            var pa = {
                queryCondition: datas.registno,
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                comCode: $("#surveyAdd").attr('comCode') ? $("#surveyAdd").attr('comCode') : loginInfo.comCode,
                policycomcode: $("#policyAdd").attr('policycomcode') ? $("#policyAdd").attr('policycomcode') : loginInfo.comCode

            }
            parent.layer.open({
                type: 2,
                title: "案件清单明细",
                area: ['95%', '440px'],
                resize: false,
                move: false,
                content: 'piccSxHtml/caseManageConfig/caseDetailedManage/caseDetailDetailed.html?' + getParam(pa)
            });
        }
    });

    // 查询
    $('.search-btn').on('click', function() {
        if (!$("#startTime").val() || !$("#endTime").val()) {
            layuimini.msg_error('请输入完整开始或结束日期');
            return;
        } else {
            var issameMonth = sameMonth($("#startTime").val(), $("#endTime").val());
            if (issameMonth == false) return;
        }
        tableFun();
        $(".orgIdBox").hide();
    });

    //回车
    enterKey('.search-btn');
    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#startTime").val('');
        $("#endTime").val('');
        $("#queryCondition").val('');
        $("#surveyAdd").val('');
        $("#policyAdd").val('');
        par.comCode = $("#surveyAdd").attr('comCode', '');
        par.policycomcode = '';
        form.render();
        tableFun();
    });

});