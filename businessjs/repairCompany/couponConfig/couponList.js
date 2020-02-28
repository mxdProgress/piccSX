layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var getLoginInfo = loginInfo();
    var date = getDate();

    laydate.render({
        elem: '#startTime',
        trigger: 'click'
    });

    laydate.render({
        elem: '#endTime',
        trigger: 'click'
    });

    $("#startTime").val(getCurrentMonthFirst());
    $("#endTime").val(getCurrentMonthLast());


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

    function tableFun(st, et) {
        table.render({
            elem: '#orgView',
            url: serverconfig.baseurl + serverconfig.interface.queryCouponInfo,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                factorycode: $("#repairCompany").val(),
                startTime: st, //$("#startTime").val() + " 00:00:00"
                endTime: et, //$("#endTime").val() + " 23:59:59"
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
                    { field: 'factoryname', width: 250, title: '维修单位名称' },
                    { field: 'creatorName', title: '创建人姓名', },
                    { field: 'name', title: '名称', },
                    { field: 'amount', title: '金额' },
                    { field: 'startDay', title: '开始日期' },
                    { field: 'endDay', title: '截止日期' },
                    { field: 'detailDesc', title: '优惠描述' },
                    { field: 'right', title: '操作', toolbar: '#barBtn', fixed: 'right' }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }
    tableFun(getCurrentMonthFirst() + " 00:00:00", getCurrentMonthLast() + " 23:59:59");


    table.on('tool(orgView)', function(obj) {
        var event = obj.event;
        var datas = obj.data;

        if (event == "editBtn") {
            var obj = {
                id: datas.id,
                amount: datas.amount,
                name: datas.name,
                endDay: datas.endDay,
                startDay: datas.startDay,
                detailDesc: datas.detailDesc,
                conditionDesc: datas.conditionDesc,
                factorycode: datas.factorycode
            }
            parent.layer.open({
                type: 2,
                title: "编辑优惠券",
                area: ['50%', '98%'],
                resize: false,
                move: false,
                content: '/piccSxHtml/repairCompany/couponConfig/couponEdit.html?' + getParam(obj),
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
                    var arr = [];
                    arr.push(datas.id);
                    jqpost(serverconfig.interface.couponDeleteByIds, { ids: arr }, true, function(data) {
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

    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增优惠券",
            area: ['50%', '98%'],
            resize: false,
            move: false,
            content: '/piccSxHtml/repairCompany/couponConfig/couponAdd.html',
        });
    });

    // 查询
    $('.search-btn').on('click', function() {
        tableFun($("#startTime").val(), $("#endTime").val());
    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() { //给输入框绑定按键事件
        if (event.keyCode == "13") { //判断如果按下的是回车键则执行下面的代码
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#startTime").val('');
        $("#endTime").val('');
        $("#repairCompany").val('');
        form.render();
        tableFun();
    });

});