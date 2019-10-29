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

    var systemuserManageDistributionForm = layui.data('systemuserManageDistributionForm');
    var time = layui.data('time')['time'];
    var userId = systemuserManageDistributionForm['userId' + time];
    var orgId = systemuserManageDistributionForm['orgId' + time];
    var pa = {
        userId: userId,
        orgId: orgId
    }


    //自定义验证规则
    form.verify(formvalidator);

    jqpost(serverconfig.interface.roleOrganRoleTree, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        zTree.init($("#systemuserManageDistributiontreeDemo"), setting, data.detail);
        layui.form.render();
    });

    //监听提交
    form.on('submit(demo1)', function(data) {
        var zTreeOjb = zTree.getZTreeObj("systemuserManageDistributiontreeDemo"); //ztree的Id  zTreeId
        var checkedNodes = zTreeOjb.getCheckedNodes(true);
        var organizationRoleIds = new Array();
        for (var aa in checkedNodes) {
            if (checkedNodes[aa].type == 4) {
                organizationRoleIds.push(checkedNodes[aa].orgId);
            }
        }
        data.field["organizationRoleIds"] = organizationRoleIds;
        data.field["userId"] = pa.userId;
        data.field["type"] = 2;
        jqpost(serverconfig.interface.roleOrganRoleUserAddUser, data.field, true, function(data) {
            if (data.status == 1) {
                parent.layuimini.msg_success('操作成功');
                setTimeout(function() {
                    //跳转
                    layuimini.getChangeTab('人保用户');
                    //刷新
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                    //关闭
                    layuimini.getTitleDelTab('分配角色');
                }, 1000);
            }
        });

        return false;
    });
});