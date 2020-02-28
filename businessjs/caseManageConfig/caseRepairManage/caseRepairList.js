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
    });

    laydate.render({
        elem: '#endTime',
    });

    $("#startTime").val(date);
    $("#endTime").val(date);

    function tableFun() {
        var pa = {
            isPage: "1",
            startTime: $("#startTime").val(),
            endTime: $("#endTime").val(),
            queryCondition: $("#queryCondition").val().toLocaleUpperCase(),
            tabCode: $("#webQryStatus").val() == '' ? 0 : $("#webQryStatus").val(),
            thirdflag: $("#thirdflag").val(),
            comCode: LoginInfo.comCode,
            userId: LoginInfo.userId,
            accountType: 1
        }
        var cols = [
            { field: 'registno', width: 220, title: '案件号', fixed: 'left' },
            { field: 'licenseno', width: 100, title: '车牌号' },
            { field: 'resourceflagDesc', title: '资源类型' },
            { field: 'reporttime', width: 160, title: '报案时间', sort: true },
            { field: 'reportaddress', title: '出险地址' },
            { field: 'thirdflagDesc', title: '是否三者车' },
            { field: 'arriveStatusDesc', title: '送修状态' },
            { field: 'brandname', title: '车型名称' },
            { field: 'right', width: 180, title: '操作', toolbar: '#barBtn', fixed: 'right' }
        ]
        tablePost('#caseInfomation', serverconfig.interface.queryCaseRepairList, true, pa, cols);



        // table.render({
        //     elem: '#caseInfomation',
        //     url: serverconfig.baseurl + serverconfig.interface.queryCaseRepairList,
        //     method: "POST",
        //     headers: { token: cookie.get("tokenKey") },
        //     contentType: "application/json; charset=utf-8",
        //     sort: true,
        //     where: {
        //         isPage: "1",
        //         startTime: $("#startTime").val(),
        //         endTime: $("#endTime").val(),
        //         queryCondition: $("#queryCondition").val().toLocaleUpperCase(),
        //         tabCode: $("#webQryStatus").val() == '' ? 0 : $("#webQryStatus").val(),
        //         thirdflag: $("#thirdflag").val(),
        //         comCode: LoginInfo.comCode,
        //         userId: LoginInfo.userId,
        //         accountType: 1
        //     },
        //     request: {
        //         pageName: 'startPage',
        //         limitName: 'pageSize'
        //     },
        //     page: true,
        //     limit: pagesize,
        //     response: {
        //         statusName: 'status',
        //         statusCode: 1,
        //         msgName: 'info',
        //         countName: 'count',
        //         dataName: 'list'
        //     },
        //     cols: [
        //         [
        //             { field: 'registno', width: 220, title: '案件号', fixed: 'left' },
        //             { field: 'licenseno', width: 100, title: '车牌号' },
        //             { field: 'resourceflagDesc', title: '资源类型' },
        //             { field: 'reporttime', width: 160, title: '报案时间', sort: true },
        //             { field: 'reportorname', width: 110, title: '报案人姓名' },
        //             { field: 'reportorphone', title: '报案人手机号' },
        //             { field: 'reportaddress', title: '出险地址' },
        //             { field: 'thirdflagDesc', title: '是否三者车' },
        //             { field: 'arriveStatusDesc', title: '送修状态' },
        //             { field: 'brandname', title: '车型名称' },
        //             { field: 'right', width: 180, title: '操作', toolbar: '#barBtn', fixed: 'right' }
        //         ]
        //     ],
        //     done: function(res) {
        //         if (res.status == 3) {
        //             window.location = '/login.html';
        //         }
        //     }
        // });
    }
    tableFun();


    table.on('tool(caseInfomation)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "detailBtn") {
            // if (datas.receiveStatus == '0') {
            //     parent.layuimini.msg_success('请先接受案件');
            // }
            layuimini.getTitleDelTab('送修详情');
            var time = new Date().getTime();
            layui.data('time', {
                key: 'time',
                value: time
            });
            layui.data('caseInformation', {
                key: 'id' + time,
                value: datas.id
            });
            layui.data('caseInformation', {
                key: 'registno' + time,
                value: datas.registno
            });
            // parent.layer.open({
            //     type: 2,
            //     title: "详情",
            //     area: ['95%', '98%'],
            //     resize: false,
            //     move: false,
            //     content: 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairDetail.html?' + getParam({ registno: datas.registno, id: datas.id }),
            // });

        } else if (event == 'agree') {
            parent.layer.open({
                title: '提示',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认接收该案件？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var receiveStatus;
                    if (datas.receiveStatus == '0') {
                        receiveStatus = '1'
                    } else {
                        receiveStatus = '0'
                    }
                    var par = {
                        "id": datas.id,
                        "userId": LoginInfo.userId,
                        "receiveStatus": receiveStatus,
                        "receiverId": LoginInfo.userId
                    };
                    jqpost(serverconfig.interface.updateCaseInfo, par, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            // parent.layuimini.msg_success('操作成功');
                            tableFun();
                            // setTimeout(function() {
                            layuimini.getTitleDelTab('送修详情');
                            var tabId = 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairDetail.html',
                                href = 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairDetail.html',
                                icon = 'fa fa-window-maximize',
                                title = '送修详情',
                                title = '<i class="' + icon + '"></i><span class="layui-left-nav"> ' + title + '</span>';
                            if (tabId == null || tabId == undefined) {
                                tabId = new Date().getTime();
                            }
                            // 判断该窗口是否已经打开过
                            var checkTab = layuimini.checkTab(tabId, true);
                            if (!checkTab) {
                                var layuiminiTabInfo = JSON.parse(sessionStorage.getItem("layuiminiTabInfo"));
                                if (layuiminiTabInfo == null) {
                                    layuiminiTabInfo = {};
                                }
                                layuiminiTabInfo[tabId] = { href: href, title: title }
                                sessionStorage.setItem("layuiminiTabInfo", JSON.stringify(layuiminiTabInfo));
                                parent.layui.element.tabAdd('layuiminiTab', {
                                    title: title + '<i data-tab-close="" class="layui-icon layui-unselect layui-tab-close">ဆ</i>' //用于演示
                                        ,
                                    content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>',
                                    id: tabId
                                });
                            }
                            parent.layui.element.tabChange('layuiminiTab', tabId);
                            layuimini.tabRoll();

                            var time = new Date().getTime();
                            layui.data('time', {
                                key: 'time',
                                value: time
                            });
                            layui.data('caseInformation', {
                                key: 'id' + time,
                                value: datas.id
                            });
                            layui.data('caseInformation', {
                                key: 'registno' + time,
                                value: datas.registno
                            });
                            // }, 2000)
                        }
                    });
                }
            });
        } else if (event == 'cancelAgree') {
            parent.layer.open({
                title: '提示',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认取消接收该案件？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var receiveStatus;
                    if (datas.receiveStatus == '0') {
                        receiveStatus = '1'
                    } else {
                        receiveStatus = '0'
                    }
                    var par = {
                        "id": datas.id,
                        "userId": LoginInfo.userId,
                        "receiveStatus": receiveStatus,
                        "receiverId": LoginInfo.userId
                    };
                    jqpost(serverconfig.interface.updateCaseInfo, par, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('操作成功');
                            tableFun();

                        }
                    });
                }
            });
        }
    });

    table.on('sort(caseInfomation)', function(obj) {
        table.reload('caseInfomation', {
            initSort: obj,
            elem: '#caseInfomation',
            url: serverconfig.baseurl + serverconfig.interface.queryCaseRepairList,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            autoSort: false,
            where: {
                isPage: "1",
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val(),
                queryCondition: $("#queryCondition").val().toLocaleUpperCase(),
                tabCode: $("#webQryStatus").val() == '' ? 0 : $("#webQryStatus").val(),
                thirdflag: $("#thirdflag").val(),
                comCode: LoginInfo.comCode,
                userId: LoginInfo.userId,
                accountType: 1,
                orderStr: obj.type
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
                    { field: 'resourceflagDesc', title: '资源类型' },
                    { field: 'reporttime', title: '报案时间', sort: true },
                    { field: 'reportorname', title: '报案人姓名' },
                    { field: 'reportorphone', title: '报案人手机号' },
                    { field: 'reportaddress', title: '出险地址' },
                    { field: 'thirdflagDesc', title: '是否三者车' },
                    { field: 'arriveStatusDesc', title: '送修状态' },
                    { field: 'brandname', title: '车型名称' },
                    { field: 'right', width: 180, title: '操作', toolbar: '#barBtn', fixed: 'right' }
                ]
            ]
        });





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
    });

    //回车
    $('#searchValue').keydown(function() {
        if (event.keyCode == "13") {
            $('.search-btn').click();
        }
    });

    setInterval(function() {
        tableFun();
    }, 15000);


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