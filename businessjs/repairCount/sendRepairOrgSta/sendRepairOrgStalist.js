layui.use(['form', 'layer', 'table', 'laytpl', 'laydate', 'layuimini', 'laypage'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        laypage = layui.laypage,
        laytpl = layui.laytpl,
        $ = layui.jquery;
    var date = getDate();
    var loginInfo = getLoginInfo();
    var pa = {};
    var list;
    var nowCurr = 1;


    laydate.render({
        elem: '#startTime',
        type: 'datetime'

    });

    laydate.render({
        elem: '#endTime',
        type: 'datetime'
    });

    $("#startTime").val(getCurrentMonthFirst() + " 00:00:00");
    $("#endTime").val(getCurrentMonthLast() + " 23:59:59");

    /**树展示**/
    treeFun('treetable', loginInfo.orgId, 1);
    setTimeout(function() {
        treeFun('treetable1', loginInfo.orgId, 1);
    }, 1000)


    $(".orgId").on('click', function() {
        $(this).next().slideToggle(100);
    })

    function tableFun() {
        // pa.isPage = "1";
        // pa.startTime = $("#startTime").val();
        // pa.endTime = $("#endTime").val();
        // pa.thirdflag = $("#thirdflag").val();
        // pa.resourceflag = $("#resourceflag").val();
        // pa.comCode = $("#surveyAdd").attr('comCode') ? $("#surveyAdd").attr('comCode') : loginInfo.comCode;
        // pa.policycomcode = $("#policyAdd").attr('policycomcode') ? $("#policyAdd").attr('policycomcode') : loginInfo.comCode;
        // var cols = [
        //     { field: 'orgName', title: '查勘属地', fixed: 'left' },
        //     { field: 'cxCount', title: '出险案件量' },
        //     { field: 'sxCount', title: '送修案件量' },
        //     { field: 'ycsxcgCount', title: '一次成功量' },
        //     { field: 'ecsxcgCount', title: '二修成功量' },
        //     { field: 'zcgCount', title: '总成功量' },
        //     { field: 'sxRate', title: '送修率' },
        //     { field: 'ycsxcgRate', title: '一次成功率' },
        //     { field: 'ecsxcgRate', title: '二次成功率' },
        //     { field: 'zcgRate', title: '总成功率' },
        //     { field: 'right', field: 'lossRate', title: '流失率', fixed: 'right' }
        // ]
        // tablePost('#caseInfomation', serverconfig.interface.sendRepairOrgSta, false, pa, cols);

        pa.isPage = "1";
        pa.startTime = $("#startTime").val();
        pa.endTime = $("#endTime").val();
        pa.thirdflag = $("#thirdflag").val();
        pa.resourceflag = $("#resourceflag").val();
        pa.comCode = $("#surveyAdd").attr('comCode') ? $("#surveyAdd").attr('comCode') : loginInfo.comCode;
        pa.policycomcode = $("#policyAdd").attr('policycomcode') ? $("#policyAdd").attr('policycomcode') : loginInfo.comCode;
        jqpost(serverconfig.interface.sendRepairOrgSta, pa, true, function(data) {
            list = data.list;
            var currFirst = (nowCurr - 1) * pagesize;
            var currLast = nowCurr * pagesize;
            var listArr = list.slice(currFirst, currLast);
            var getTpl = templateTpl.innerHTML;

            laytpl(getTpl).render(listArr, function(html) {
                templateView.innerHTML = html;
                form.render();
            });

            laypage.render({
                elem: 'demo20',
                count: list.length,
                limit: 20,
                curr: nowCurr,
                prev: "<em><</em>",
                next: "<em>></em>",
                layout: ['prev', 'page', 'next', 'skip', 'count'],
                jump: function(obj, first) {
                    if (!first) {
                        nowCurr = obj.curr;
                        var currFirst = (nowCurr - 1) * pagesize;
                        var currLast = nowCurr * pagesize;
                        var listArr = list.slice(currFirst, currLast);
                        var getTpl = templateTpl.innerHTML;
                        laytpl(getTpl).render(listArr, function(html) {
                            templateView.innerHTML = html;
                            form.render();
                        });
                    }
                }
            });
        });
    }
    tableFun();


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
        nowCurr = 1;
    });

    //回车
    enterKey('.search-btn');
    // 清空按钮 
    $('.clear-btn').on('click', function() {
        $("#thirdflag").val('');
        $("#resourceflag").val('');
        $("#surveyAdd").val('');
        $("#policyAdd").val('');
        pa.comCode = $("#surveyAdd").attr('comCode', '');
        pa.policycomcode = '';
        form.render();
        tableFun();
        nowCurr = 1;
    });

});