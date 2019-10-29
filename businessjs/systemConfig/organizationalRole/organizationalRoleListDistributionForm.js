var zTree;
var setting = {
    check: {
        enable: true
    },
    data: {
        key: {
            children: "childList",
            name: "name",
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


    var organizationalRoleListDistributionForm = layui.data('organizationalRoleListDistributionForm');
    var time = layui.data('time')['time'];
    var organizationRoleId = organizationalRoleListDistributionForm['organizationRoleId' + time];
    var pa = { organizationId: organizationRoleId };



    //自定义验证规则
    form.verify(formvalidator);

    jqpost(serverconfig.interface.roleOrganRoleUserTree, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        zTree.init($("#organizationalRoleListDistributiontreeDemo"), setting, data.detail);
        layui.form.render();
    });

    //监听提交
    form.on('submit(demo1)', function(data) {
        var zTreeOjb = zTree.getZTreeObj("organizationalRoleListDistributiontreeDemo"); //ztree的Id  zTreeId
        var checkedNodes = zTreeOjb.getCheckedNodes(true);
        var maintenanceIds = new Array();
        for (var aa in checkedNodes) {
            if (checkedNodes[aa].type == 3) {
                maintenanceIds.push(checkedNodes[aa].orgId);
            }
        }
        data.field["organizationRoleId"] = organizationRoleId;
        data.field["userIds"] = maintenanceIds;
        jqpost(serverconfig.interface.roleOrganRoleUserAddUser, data.field, true, function(data) {
            parent.layer.msg('操作成功');

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('组织角色维护');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                layuimini.getTitleDelTab('分配用户');
            }, 1000);
        });

        return false;
    });
});