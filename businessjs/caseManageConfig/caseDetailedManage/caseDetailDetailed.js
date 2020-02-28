layui.use(['form', 'layer', 'table', 'laydate', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var loginInfo = getLoginInfo();
    var urlPar = getParamsFromURL();

    function detailedFun() {
        jqpost(serverconfig.interface.queryDetailedList, urlPar, true, function(data) {
            if (data.list.length > 0) {
                var res = data.list[0];
                var ele = $(".tableInfo tr td");
                ele.each(function(i, e) {
                    var id = $(this).attr('id');
                    if (id) {
                        $(this).text(res[id] || '无')
                    }
                });
            }
        });
    }

    detailedFun();





});