layui.use(['form', 'layedit', 'laydate', 'layuimini', 'dtree', 'jquery'], function() {
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        dtree = layui.dtree,
        $ = layui.jquery;
    var orgId;
    var par = {};
    var getLoginInfo = loginInfo();

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

    form.on('select(piccOrg)', function(data) {
        if (data.value == '2') {
            $(".factoryCode").show();
        } else {
            $(".factoryCode").hide();
        }
    });
    //监听提交
    form.on('submit(demo1)', function(data) {
        if (data.field.orgType == "2") {
            if (!data.field.factoryCode) {
                parent.layuimini.msg_error('请输入维修厂代码');
                return false;
            }
        }
        data.field.orgId = orgId;
        jqpost(serverconfig.interface.orgSaveOrg, data.field, true, function() {
            parent.layuimini.msg_success('操作成功');
            $("#czBtn").click();

            setTimeout(function() {
                //跳转
                layuimini.getChangeTab('组织机构');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                //关闭
                layuimini.getTitleDelTab('新增机构');
            }, 1000);
        });
        return false;
    });
});