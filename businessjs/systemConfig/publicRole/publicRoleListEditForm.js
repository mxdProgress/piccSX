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
        laydate = layui.laydate,
        $ = layui.jquery;

    var publicRoleListEditForm = layui.data('publicRoleListEditForm');
    var time = layui.data('time')['time'];
    var operationids = publicRoleListEditForm['operationid' + time];
    var pa = { commonRoleId: operationids, type: 1 };

    jqpost(serverconfig.interface.roleCommonRoleSelectCommonRole, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        zTree.init($("#publicRoletreeDemo"), setting, data.detail.maintenanceTree);
        layui.form.render();
    });

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
        jqpost(serverconfig.interface.roleCommonRoleUpdateCommonRole, data.field, true, function(data) {
            if (data.status == 1) {
                parent.layuimini.msg_success('操作成功');
                $("#czBtn").click();

                setTimeout(function() {
                    //跳转
                    layuimini.getChangeTab('公共角色维护');
                    //刷新
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                    //关闭
                    layuimini.getTitleDelTab('编辑公共角色');
                }, 1000);
            }
        });

        return false;
    });
});