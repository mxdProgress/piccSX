layui.use(['form', 'layedit', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        $ = layui.jquery;
    var orgId;
    var par = {};
    var getLoginInfo = loginInfo();

    var systemuserManageListEditForm = layui.data('systemuserManageListEditForm');
    var time = layui.data('time')['time'];
    var userid = systemuserManageListEditForm['userid' + time];
    var realName = systemuserManageListEditForm['realName' + time];
    var phone = systemuserManageListEditForm['phone' + time];
    var org = systemuserManageListEditForm['orgId' + time];
    var userName = systemuserManageListEditForm['userName' + time];
    var passWord = systemuserManageListEditForm['passWord' + time];
    var orgNames = systemuserManageListEditForm['orgNames' + time];


    loadJsonDataToForm({
        realName: realName,
        phone: phone,
        orgId: orgNames,
        userName: userName,
        passWord: passWord
    });


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

    //监听提交
    form.on('submit(demo1)', function(data) {
        data.field.userName = (data.field.userName).trim();
        data.field.userId = userid;
        if (!orgId) {
            data.field.orgId = org;
        } else {
            data.field.orgId = orgId;
        }
        var psCheck = CheckPassWord(data.field.passWord);
        if (!psCheck && data.field.passWord.length < 25) {
            layer.msg('密码必须为字母加数字加特殊符号且长度不小于8位');
        } else {
            if (data.field.oldpassword != data.field.passWord) {
                data.field.passWord = md5(data.field.passWord);
            }
            jqpost(serverconfig.interface.userAdminModifyUserInfo, data.field, true, function() {
                parent.layer.msg('操作成功');

                setTimeout(function() {
                    //跳转
                    layuimini.getChangeTab('修理厂用户');
                    //刷新
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                    //关闭
                    layuimini.getTitleDelTab('编辑用户');
                }, 1000);
            });
        }
        return false;
    });
});