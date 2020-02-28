var zTree;
var setting = {
    check: {
        enable: true
    },
    data: {
        key: {
            children: "childList",
            name: "title",
            isParent: "parent"
        }
    }
};

$(document).ready(function() {
    zTree = $.fn.zTree;
});

layui.use(['form', 'layedit', 'laydate'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
    $ = layui.jquery;
    var getLoginInfo = loginInfo();



    // 初始化上级机构下拉框
    // getdgtree("orgId");


    function search() {
        par.orgId = getLoginInfo.orgId;
        par.levelFlag = 2;
        par.orgType = '1';
        // 请求
        jqpost(serverconfig.interface.getOrgList, par, true, tplDate);
    }
    search();
    $("#orgId").on('click', function() {
        $("#orgIdBox").slideToggle(100);
    });

    function tplDate(data, status, xhr) {
        $("#treetable tbody").empty();
        var da = data.list;
        filterJsonObj(da);
        if (da.length > 0) {
            var html = '';
            var orgids;
            for (var i = 0; i < da.length; i++) {
                var orgIdLen = da[i].orgId;
                if (orgIdLen.length > 3) {
                    orgids = da[i].orgId.substr(0, da[i].orgId.length - 4);
                } else {
                    orgids = '';
                }
                if (da[i].parent == false) {
                    html += '<tr data-tt-id="' + da[i].orgId + '" data-tt-parent-id="' + orgids + '">';
                } else {
                    html += '<tr data-tt-id="' + da[i].orgId + '" data-tt-branch="true" data-tt-parent-id="' + orgids + '">';
                }
                html += '<td>' + da[i].orgName + '</td>';
                html += '<td style="width:50px;"><button orgId="' + da[i].orgId + '" orgName="' + da[i].orgName + '" class="layui-btn layui-btn-sm selectBtn" >选择</button>';
                html += '</tr>';
            }
            $("#treetable tbody").append(html);
            $(".selectBtn").on('click', function() {
                orgId = $(this).attr('orgId');
                var tdVal = $(this).attr('orgName');
                $("#orgId").val(tdVal);
                $("#orgIdBox").hide();
                return false;
            })
        }

        $("#treetable").treetable({
            expandable: true,
            onNodeExpand: nodeExpand
        });
    }

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
                        html += '<td>' + da[i].orgName + '</td>';
                        html += '<td style="width:50px;"><button orgId="' + da[i].orgId + '" orgName="' + da[i].orgName + '" class="layui-btn layui-btn-sm selectBtn" >选择</button>';
                        html += '</tr>';
                    }
                }
                //子节点数据插入父节点
                $("#treetable").treetable("loadBranch", parentNode, html);
                $(".selectBtn").on('click', function() {
                    orgId = $(this).attr('orgId');
                    var tdVal = $(this).attr('orgName');
                    $("#orgId").val(tdVal);
                    $("#orgIdBox").hide();
                    return false;
                })
            }
        });

    }





    //自定义验证规则
    form.verify(formvalidator);

    // 创建公共模版下拉框
    jqpost(serverconfig.interface.roleCommonRoleList, { enableUse: 1, commonEnable: 1 }, true, function(data, status, xhr) {
        for (var i in data.list) {
            $("#commonRoleId").append("<option value='" + data.list[i].commonRoleId + "'>" + data.list[i].commonRoleName + "</option>");
        }
        layui.form.render();
    });

    form.on('select(commonRoleIdchange)', function(pdata) {
        var pa = { commonRoleId: pdata.value, type: 2 };
        jqpost(serverconfig.interface.roleCommonRoleSelectCommonRole, pa, true, function(data, status, xhr) {
            loadJsonDataToForm(data.detail);
            zTree.init($("#organizationalRoletreeDemo"), setting, data.detail.maintenanceTree);
            layui.form.render();
        });
    });

    //监听提交
    form.on('submit(demo1)', function(data) {
        var zTreeOjb = zTree.getZTreeObj("organizationalRoletreeDemo"); //ztree的Id  zTreeId
        var checkedNodes = zTreeOjb.getCheckedNodes(true);
        var maintenanceIds = new Array();
        for (var aa in checkedNodes) {
            maintenanceIds.push(checkedNodes[aa].funcId);
        }
        data.field["maintenanceIds"] = maintenanceIds;
        data.field.orgId = orgId;

        jqpost(serverconfig.interface.roleOrganRoleSaveOrganRole, data.field, true, function() {
            parent.layer.msg('操作成功');

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('组织角色维护');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                parent.layer.closeAll();
            }, 1000);

        });
        return false;
    });
});