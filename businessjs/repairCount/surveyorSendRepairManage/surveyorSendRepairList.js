layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var date = getDate();
    var loginInfo = getLoginInfo();
    var pa = {};

    laydate.render({
        elem: '#startTime',

    });

    laydate.render({
        elem: '#endTime',
    });

    $("#startTime").val(getCurrentMonthFirst());
    $("#endTime").val(getCurrentMonthLast());

    /**树展示**/
    treeFun('treetable', loginInfo.orgId, 1);
    setTimeout(function() {
        treeFun('treetable1', loginInfo.orgId, 1);
    }, 1000)


    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    function tableFun() {


        pa.isPage = "1";
        pa.startTime = $("#startTime").val();
        pa.endTime = $("#endTime").val();
        pa.thirdflag = $("#thirdflag").val();
        pa.resourceflag = $("#resourceflag").val();
        pa.comCode = $("#surveyAdd").attr('comCode') ? $("#surveyAdd").attr('comCode') : loginInfo.comCode;
        pa.policycomcode = $("#policyAdd").attr('policycomcode') ? $("#policyAdd").attr('policycomcode') : loginInfo.comCode;
        var cols = [
            { field: 'surveyorName', title: '查勘员姓名', fixed: 'left' },
            { field: 'cxCount', title: '出险案件量' },
            { field: 'sxCount', title: '送修案件量' },
            { field: 'ycsxcgCount', title: '一次成功量', },
            { field: 'ecsxcgCount', title: '二修成功量' },
            { field: 'zcgCount', title: '总成功量' },
            { field: 'sxRate', title: '送修率' },
            { field: 'ycsxcgRate', title: '一次成功率' },
            { field: 'ecsxcgRate', title: '二次成功率' },
            { field: 'zcgRate', title: '总成功率' },
            { field: 'lossRate', title: '流失率' },
        ]
        tablePost('#caseInfomation', serverconfig.interface.surveyorSendRepairSta, true, pa, cols);
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
            var st = $("#startTime").val();
            var ed = $("#endTime").val();
            var startTime = new Date(st.replace(new RegExp("-", "gm"), "/"));
            var endTime = new Date(ed.replace(new RegExp("-", "gm"), "/"));
            if (startTime.getFullYear() != endTime.getFullYear()) {
                layuimini.msg_error('日期不能夸年');
                return;
            }
        }
        tableFun();
        $(".orgIdBox").hide();
    });

    //回车
    enterKey('.search-btn');
    // 清空按钮
    $('.clear-btn').on('click', function() {
        // $("#startTime").val('');
        // $("#endTime").val('');
        $("#thirdflag").val('');
        $("#resourceflag").val('');
        $("#surveyAdd").val('');
        $("#policyAdd").val('');
        pa.comCode = $("#surveyAdd").attr('comCode', '');
        pa.policycomcode = '';
        form.render();
        tableFun();
    });

});