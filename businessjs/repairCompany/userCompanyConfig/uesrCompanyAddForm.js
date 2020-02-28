layui.use(['form', 'layer', 'table', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        $ = layui.jquery;
    var getLoginInfo = loginInfo();
    console.log(getLoginInfo);
    var checkOrgId;
    var par = {}


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






    function repairComFun() {
        var pa = {};
        if (getLoginInfo.comCode) {
            pa.comcode = getLoginInfo.comCode;
        } else {
            pa.queryCondition = getLoginInfo.orgName;
        }

        jqpost(serverconfig.interface.queryFactoryInfo, pa, true, function(data, status, xhr) {
            var daObj = data.list;
            if (daObj) {
                for (var i = 0; i < daObj.length; i++) {
                    $("#repairCompany").append("<option value='" + daObj[i].factorycode + "' >" + daObj[i].factoryname + "</option>");
                };
                form.render();
            }
        });
    }
    repairComFun();

    function tableFun(orgId) {
        table.render({
            elem: '#tableId',
            url: serverconfig.baseurl + serverconfig.interface.queryUserByCommonRole,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                orgId: orgId,
                queryType: $("#roleType").val()
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
                    { field: 'realName', title: '姓名', },
                    { field: 'userName', title: '用户名' },
                    { field: 'orgName', title: '机构名称' },
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
    $("#submitBtn").on('click', function() {
        var checkStatus = table.checkStatus('tableId');
        var factoryCode = $("#repairCompany").val();
        var arrFactory = [];
        arrFactory.push(factoryCode);
        if (!factoryCode) {
            layuimini.msg_error('请选择维修单位');
            return;
        } else if (checkStatus.data.length == 0) {
            layuimini.msg_error('请选择人员');
            return;
        };
        var pa = {
            userId: checkStatus.data[0].userId,
            factorycodes: arrFactory
        };
        jqpost(serverconfig.interface.addUserFacRelation, pa, true, function(data, status, xhr) {
            if (data.status == 1) {
                layuimini.msg_success('关联成功');
                //刷新
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            }

        });
    });
    table.on('tool(tableId)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "deleteBtn") {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认删除吗？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var arr = [];
                    arr.push(datas.id);
                    jqpost(serverconfig.interface.userDeleteByIds, { ids: arr }, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('删除成功');
                            tableFun();
                        }
                    });
                }
            });
        }
    });

    // 查询
    $('.search-btn').on('click', function() {
        if (!checkOrgId) {
            var orgId = getLoginInfo.orgId;
        } else {
            var orgId = checkOrgId;
        }
        if ($("#orgId").val()) {
            tableFun(orgId);
        } else {
            tableFun();
        }

    });

    //回车执行搜索功能
    $('#searchValue').keydown(function() { //给输入框绑定按键事件
        if (event.keyCode == "13") { //判断如果按下的是回车键则执行下面的代码
            $('.search-btn').click();
        }
    });

    // 清空按钮
    $('.clear-btn').on('click', function() {
        $("#orgId").val('');
        $("#roleType").val('');
        $("#repairCompany").val('');
        form.render();
        tableFun();
    });
})