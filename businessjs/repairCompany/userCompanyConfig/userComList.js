layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    // 初始化上级机构下拉框
    var loginInfo = getLoginInfo();
    var checkOrgId;


    function searchGetOrg() {
        par.orgId = loginInfo.orgId;
        par.levelFlag = 2;
        par.orgType = '1';
        // 请求
        jqpost(serverconfig.interface.getOrgList, par, true, function(data) {
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
        });
    }
    searchGetOrg();

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


    $("#orgId").on('click', function() {
        $("#orgIdBox").slideToggle(100);
    });


    function tableFun(orgId) {

        table.render({
            elem: '#tableId',
            url: serverconfig.baseurl + serverconfig.interface.queryUserFacRelation,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                queryCondition: $("#searchValue").val(),
                userId: getLoginInfo.userId,
                orgId: orgId,
                factorycode: getLoginInfo.factorycode
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: pagesize,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
            },
            cols: [
                [
                    { type: 'radio', fixed: 'left' },
                    { field: 'realName', width: 100, title: '姓名', },
                    { field: 'userName', width: 100, title: '用户名' },
                    { field: 'orgName', title: '机构名称' },
                    { field: 'factoryName', title: '维修单位名称', },
                    { field: 'address', title: '维修单位地址' },
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }
    tableFun();

    //删除关联信息
    $('.deleteBtn').on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        var arr = [];
        if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        }
        arr.push(checkStatus.data[0].id);
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除关联信息吗？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.userDeleteByIds, { ids: arr }, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.close(index);
                        parent.layuimini.msg_success('删除成功');
                        tableFun();
                    }
                });
            }
        });
    });
    //删除所有修理厂
    $('.deleteBtnFoctory').on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        }
        parent.layer.open({
            title: '',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认删除所有关联维修单位吗？</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                jqpost(serverconfig.interface.deleteRelByUserId, { userId: checkStatus.data[0].userId }, true, function(data) {
                    if (data.status == 1) {
                        parent.layer.close(index);
                        parent.layuimini.msg_success('删除成功');
                        tableFun();
                    }
                });
            }
        });
    });


    $(".add-btn").on('click', function() {
        parent.layer.open({
            type: 2,
            title: "新增关联",
            area: ['75%', '90%'],
            resize: false,
            move: false,
            content: '/piccSxHtml/repairCompany/userCompanyConfig/uesrCompanyAddForm.html',
        });
    });

    // 查询
    $('.search-btn').on('click', function() {
        if (!checkOrgId) {
            var orgId = loginInfo.orgId;
        } else {
            var orgId = checkOrgId;
        }
        tableFun(orgId);
    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() { //给输入框绑定按键事件
        if (event.keyCode == "13") { //判断如果按下的是回车键则执行下面的代码
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#searchValue").val('');
        $("#orgId").val('');
        form.render();
        tableFun('');
    });

});