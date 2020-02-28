layui.use(['form', 'layedit', 'laydate', 'layuimini'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery,
        loginInfo = getLoginInfo(),
        checkOrgId,
        orgType,
        factoryCode

    var urlPar = getParamsFromURL();
    var pa = { orgId: urlPar.orgId };

    function search() {
        par.orgId = loginInfo.orgId;
        par.levelFlag = 2;
        par.orgType = '1';
        delete par.tokenId;
        // 请求
        jqpost(serverconfig.interface.getOrgList, par, true, tplDate);
    }
    search();

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
                checkOrgId = $(this).attr('orgId');
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
                    checkOrgId = $(this).attr('orgId');
                    var tdVal = $(this).attr('orgName');
                    $("#orgId").val(tdVal);
                    $("#orgIdBox").hide();
                    return false;
                })

            }
        });

    }



    // 初始化上级机构下拉框
    // getdgtree("parentOrgId");
    jqpost(serverconfig.interface.orgSelectOrg, pa, true, function(data, status, xhr) {
        loadJsonDataToForm(data.detail);
        orgType = data.detail.orgType;
        factoryCode = data.detail.factoryCode;
        if (orgType == 2) {
            $("#orgId").on('click', function() {
                $("#orgIdBox").slideToggle(100);
            });
        } else {
            $("#orgId").attr('disabled', true);
        }
        layui.form.render();
    });

    //自定义验证规则
    form.verify(formvalidator);

    //监听提交
    form.on('submit(demo1)', function(data) {
        if (!checkOrgId) {
            data.field.parentOrgId = urlPar.parentOrgId;
        } else {
            data.field.parentOrgId = checkOrgId;
        }
        data.field.orgId = urlPar.orgId;
        data.field.orgType = orgType;
        data.field.factoryCode = factoryCode;
        jqpost(serverconfig.interface.orgUpdateOrg, data.field, true, function(data) {
            parent.layuimini.msg_success('操作成功');
            $("#czBtn").click();

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('组织机构');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                // layuimini.getTitleDelTab('编辑机构');
                parent.layer.closeAll();
            }, 1000);
        });

        return false;
    });
});