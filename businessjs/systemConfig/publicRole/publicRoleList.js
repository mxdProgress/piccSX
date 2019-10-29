layui.use(['form', 'laypage', 'layer', 'laytpl', 'layuimini'], function() {
    var laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        $ = layui.jquery;

    // checkPagePermissions($);
    var nowCurr = 1;
    var searchurl = serverconfig.interface.roleCommonRoleList;
    var delurl = serverconfig.interface.roleCommonRoleDeleteCommonRole;
    var caidanming = "公共角色";
    var par = getdefaultparam();
    // 请求
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
                layuimini.getTitleDelTab(' 编辑公共角色');
                // 保存编号
                var time = new Date().getTime();
                layui.data('publicRoleListEditForm', {
                    key: 'operationid' + time,
                    value: $(this).attr("operationid")
                });
                layui.data('time', {
                    key: 'time',
                    value: time
                })

                // window.parent.tab.tabAdd({
                //     href: '../piccHtml/sysConfig/publicRole/publicRoleListEditForm.html',
                //     icon: '',
                //     id: 'editgonggongjueseWin',
                //     title: '编辑' + caidanming
                // });

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
            // 分页
            // laypage.render({
            //     elem: 'footBar',
            //     count: data.count,
            //     layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            //     jump: function(obj, first) {
            //         if (!first) {
            //             par.startPage = obj.curr;
            //             nowCurr = obj.curr;
            //             search();
            //         } else {
            //             nowCurr = 1;
            //         }
            //     }
            // });
        });
    }
    search();
    // 查询
    $('.search-btn').on('click', function() {
        par.searchValue = $("#searchValue").val();
        par.startPage = "1";
        jqpost(searchurl, par, true, tplDate);
    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() { //给输入框绑定按键事件
        if (event.keyCode == "13") { //判断如果按下的是回车键则执行下面的代码
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
});