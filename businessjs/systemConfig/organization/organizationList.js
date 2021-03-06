layui.use(['form', 'laypage', 'layer', 'laytpl', 'layuimini'], function() {
    var laypage = layui.laypage,
        layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.jquery;
    var form = layui.form;
    var par = {};
    var getLoginInfo = loginInfo();
    par.orgId = getLoginInfo.orgId;
    par.levelFlag = 2;
    par.orgType = '1';

    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增机构",
            area: ['600px', '95%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/organization/organizationListAddForm.html',
        });
    });

    function search() {
        // 请求
        jqpost(serverconfig.interface.getOrgList, par, true, tplDate);
    }
    search();

    // 渲染模板
    function tplDate(data, status, xhr) {
        var getTpl = orgTpl.innerHTML;
        var da = data.list;
        filterJsonObj(da);

        laytpl(getTpl).render(da, function(html) {
            orgView.innerHTML = html;
            // 编辑
            $('.editBtn').on('click', function() {
                var obj = {
                    orgId: $(this).attr("orgId"),
                    parentOrgId: $(this).attr("parentOrgId")
                }
                parent.layer.open({
                    type: 2,
                    title: "编辑机构",
                    area: ['650px', '95%'],
                    resize: false,
                    move: false,
                    content: 'piccSxHtml/systemConfig/organization/organizationListEditForm.html?' + getParam(obj),
                });

            });
            // 删除
            $('.delBtn').on('click', function() {
                var delId = $(this).attr("orgid");
                layer.open({
                    title: '',
                    maxmin: false,
                    type: 1,
                    moveType: 0,
                    content: '<div style="padding: 20px 60px;">确认删除该信息吗？</div>',
                    btn: ['确定', '取消'],
                    yes: function(index) {
                        var pm = {};
                        pm.orgId = delId;
                        jqpost(serverconfig.interface.orgDeleteOrg, pm, true, function(data) {
                            if (data.status == 1) {
                                parent.layuimini.msg_success('删除成功');
                                setTimeout(function() {
                                    parent.layer.close(index);
                                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                                }, 1000);
                            }
                        });
                    }
                });
            });
            $("#treetable").treetable({
                expandable: true,
                onNodeExpand: nodeExpand
            });
        });
    }
    form.on('radio', function(data) {
        var value = data.value;
        if (value == '1') {
            par.orgType = '1';
            par.orgId = getLoginInfo.orgId;
            search();
        } else if (value == '2') {
            par.orgType = '2';
            par.orgId = getLoginInfo.orgId;
            search();
        }
    });


    //展开节点回调函数
    function nodeExpand() {
        getNodeViaAjax(this.id);
    }

    function getNodeViaAjax(id) {
        par.orgId = id;
        jqpost(serverconfig.interface.getOrgList, par, true, function(da) {
            var da = da.list;
            filterJsonObj(da);
            if (da != null) {
                var html = '';
                //获得父节点
                var parentNode = $("#treetable").treetable("node", id);

                for (var i = 0; i < da.length; i++) {
                    var nodeToAdd = $("#treetable").treetable("node", da[i].orgId);
                    if (!nodeToAdd) {
                        if (da[i].parent == false) {
                            html += '<tr data-tt-id="' + da[i].orgId + '" data-tt-parent-id="' + id + '">';
                        } else {
                            html += '<tr data-tt-id="' + da[i].orgId + '" data-tt-branch="true" data-tt-parent-id="' + id + '">';
                        }
                        html += '<td>' + da[i].orgName + '</td><td>' + da[i].simpleName + '</td><td>' + da[i].comCode + '</td><td>' + da[i].responsiblePerson + ' </td><td>' + da[i].responsiblePersonPhone + '</td>';
                        if (da[i].orgType == 1) {
                            html += '<td>人保机构</<td>';
                        } else {
                            html += '<td>维修单位</<td>';
                        }
                        html += '<td>' + da[i].remark + ' </td>';
                        html += '<td><button orgId="' + da[i].orgId + '" parentOrgId="' + da[i].parentOrgId + '" onclick="editclickMe(this)" class="layui-btn  layui-btn-sm editBtn">编辑</button>';
                        html += '<button orgId="' + da[i].orgId + '" onclick="clickMe(this)" class="layui-btn layui-btn-danger layui-btn-sm delBtn">删除</button></td>';
                        html += '</tr>';
                    }
                }
                //子节点数据插入父节点
                $("#treetable").treetable("loadBranch", parentNode, html);
            }
        });

    }

});

function clickMe(t) {
    layui.use(['laypage', 'layer', 'laytpl', 'layuimini'], function() {
        var delId = $(t).attr('orgId');
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除该信息吗？</div>',
            btn: ['确定', '取消'],
            yes: function() {
                var pm = {};
                pm.orgId = delId;
                jqpost(serverconfig.interface.orgDeleteOrg, pm, true, function() {
                    parent.layer.closeAll();
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                });
            }
        });
    });

}

function editclickMe(t) {
    layui.use(['layer'], function() {
        var obj = {
            orgId: $(t).attr("orgId"),
            parentOrgId: $(t).attr("parentOrgId")
        }
        parent.layer.open({
            type: 2,
            title: "编辑机构",
            area: ['650px', '95%'],
            resize: false,
            move: false,
            content: 'piccSxHtml/systemConfig/organization/organizationListEditForm.html?' + getParam(obj),
        });
    });
}