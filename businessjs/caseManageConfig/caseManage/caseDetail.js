layui.use(['form', 'element', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        element = layui.element,
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

    var caseInformation = layui.data('caseInformation');
    var time = layui.data('time')['time'];
    var id = caseInformation['id' + time];

    function caseDetail() {
        var pa = {
            isPage: "0",
            comCode: LoginInfo.comCode,
            factorycode: LoginInfo.factorycode,
            id: id,
            listOrDetail: 2
        }
        jqpost(serverconfig.interface.caseQueryCaseList, pa, true, function(data) {
            if (data.list != null) {
                var datas = data.list[0];
                loadJsonDataToForm(datas);
                var registno = datas.registno;
                var licenseno = datas.licenseno;
                var thirdflag = datas.thirdflag;
                var repairStatus = datas.repairStatus;
                //是维修中的状态才展示
                if (repairStatus == "2") {
                    $(".search-group").show();
                }
                processDetailFun();
                sendRepairProcessFun(registno, licenseno, thirdflag);
            }
        })
    }
    caseDetail();


    function processDetailFun() {
        table.render({
            elem: '#processDetail',
            url: serverconfig.baseurl + serverconfig.interface.caseQueryProcessDetail,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                caseId: id,
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: 10,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
            },
            cols: [
                [
                    { field: 'operatorName', title: '操作人姓名', },
                    { field: 'remark', title: '描述' },
                    { field: 'operateTime', title: '操作时间', }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }

    function sendRepairProcessFun(registno, licenseno, thirdflag) {
        table.render({
            elem: '#sendRepairProcess',
            url: serverconfig.baseurl + serverconfig.interface.caseQuerySendRepairProcess,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                registno: registno,
                licenseno: licenseno,
                thirdflag: thirdflag,
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: 10,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
            },
            cols: [
                [
                    { field: 'registno', title: '案件号', fixed: 'left' },
                    { field: 'factoryname', title: '维修单位名称', },
                    { field: 'licenseno', title: '车牌号', },
                    { field: 'operatorname', title: '操作人姓名' },
                    { field: 'inserttime', title: '操作时间' },
                    { field: 'thirdflag', title: '是否三者车' }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }

    $(".addProcessDetail").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增维修中进度详情",
            area: ['50%', '50%'],
            resize: false,
            move: false,
            content: '/piccSxHtml/caseManageConfig/caseManage/addProcessDetail.html?' + getParam({ id: id }),
        });
    })


});