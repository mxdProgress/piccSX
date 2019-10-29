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

function createtree(data, status, xhr) {
    zTree.init($("#publicRoletreeDemo"), setting, data.detail);
}


layui.use(['form', 'layedit', 'laydate', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    jqpost(serverconfig.interface.maintenanceGetMaintenanceTree, { enableUse: 1 }, true, createtree);

    //自定义验证规则
    form.verify(formvalidator);

    //监听提交
    form.on('submit(demo1)', function(data) {
        var zTreeOjb = zTree.getZTreeObj("publicRoletreeDemo"); //ztree的Id  zTreeId
        var checkedNodes = zTreeOjb.getCheckedNodes(true);
        var maintenanceIds = new Array();
        for (var aa in checkedNodes) {
            maintenanceIds.push(checkedNodes[aa].funcId);
        }
        data.field["maintenanceIds"] = maintenanceIds;

        jqpost(serverconfig.interface.roleCommonRoleSaveCommonRole, data.field, true, function() {
            parent.layuimini.msg_success('操作成功');
            $("#czBtn").click();

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('公共角色维护');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                layuimini.getTitleDelTab('新增公共角色');
            }, 1000);


        });

        return false;
    });
});