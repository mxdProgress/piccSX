layui.use(['form', 'laypage', 'layer', 'laytpl', 'layuimini'], function() {
    var laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        $ = layui.jquery;
    var searchurl = serverconfig.interface.roleCommonRoleList;
    var delurl = serverconfig.interface.roleCommonRoleDeleteCommonRole;
    var par = getdefaultparam();

    function search() {
        jqpost(searchurl, par, true, tplDate);
    }

    // 渲染模板
    function tplDate(data, status, xhr) {

        var getTpl = orgTpl.innerHTML;
        if (data.list == null) {
            return;
        }
        laytpl(getTpl).render(data.list, function(html) {
            orgView.innerHTML = html;

            // 编辑
            $('.editBtn').on('click', function() {
                var obj = {
                    operationid: $(this).attr("operationid")
                }
                parent.layer.open({
                    type: 2,
                    title: "编辑公共角色",
                    area: ['550px', '90%'],
                    resize: false,
                    move: false,
                    content: 'piccSxHtml/systemConfig/publicRole/publicRoleListEditForm.html?' + getParam(obj)
                });

            });
            // 删除
            $('.delBtn').on('click', function() {
                var operationid = $(this).attr("operationid");
                parent.layer.open({
                    title: '',
                    maxmin: false,
                    type: 1,
                    moveType: 0,
                    content: '<div style="padding: 20px 60px;">确认删除该信息吗？</div>',
                    btn: ['确定', '取消'],
                    yes: function() {
                        var pm = {};
                        pm.commonRoleId = operationid;
                        jqpost(delurl, pm, true, function() {
                            layer.closeAll();
                            par.startPage = 1;
                            search();
                        });
                    }
                });
            });
        });
    }
    search();
    // 查询
    $('.search-btn').on('click', function() {
        par.searchValue = $("#searchValue").val();
        par.startPage = "1";
        jqpost(searchurl, par, true, tplDate);
    });

    $('#searchValue').keydown(function() {
        if (event.keyCode == "13") {
            $('.search-btn').click();
        }
    });


    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#searchValue").val("");
        par.searchValue = "";
        par.startPage = "1";
        par.pageSize = pagesize;
        jqpost(searchurl, par, true, tplDate);
    });

    form.on('select(paixu)', function(data) {
        par.startPage = "1";
        delete par.usernameSort;
        delete par.realNameSort;
        delete par.orgSort;
        delete par.roleSort;
        par = getdefaultpageparam(par);
        jqpost(searchurl, par, true, tplDate);
    });

    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增公共角色",
            area: ['650px', '90%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/publicRole/publicRoleListAddForm.html',
        });
    });
});