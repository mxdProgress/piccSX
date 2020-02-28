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
layui.use(['form', 'layedit', 'laydate', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
    $ = layui.jquery;

    // var organizationalRoleListEditForm = layui.data('organizationalRoleListEditForm');
    // var time = layui.data('time')['time'];
    // var organizationRoleId = organizationalRoleListEditForm['organizationRoleId' + time];
    // var pa = { organizationRoleId: organizationRoleId };

    var urlPar = getParamsFromURL();
    var pa = { organizationRoleId: urlPar.organizationRoleId };

    //自定义验证规则
    form.verify(formvalidator);

    // 创建公共模版下拉框
    jqpost(serverconfig.interface.roleCommonRoleList, { enableUse: 1, commonEnable: 1 }, true, function(data, status, xhr) {
        for (var i in data.list) {
            $("#commonRoleId").append("<option value='" + data.list[i].commonRoleId + "'>" + data.list[i].commonRoleName + "</option>");
        }
        layui.form.render();
        jqpost(serverconfig.interface.roleOrganRoleSelectOrganRole, pa, true, function(data, status, xhr) {
            loadJsonDataToForm(data.detail);
            zTree.init($("#organizationalRoletreeDemo"), setting, data.detail.maintenanceTree);
            layui.form.render();
        });
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
        jqpost(serverconfig.interface.roleOrganRoleUpdateOrganRole, data.field, true, function(data) {
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