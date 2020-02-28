layui.use(['form', 'element', 'layer', 'table'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate,
        element = layui.element,
        $ = layui.jquery;
    var LoginInfo = getLoginInfo();
    var registinfoid;
    var factorycode;
    var checkOrgId;
    var wishgoflag;
    var caseInformation = layui.data('caseInformation');
    var time = layui.data('time')['time'];
    var id = caseInformation['id' + time];
    var registno = caseInformation['registno' + time];
    var flag = true;

    function searchDetail() {
        var pa = {};
        pa.id = id;
        pa.registno = registno;
        pa.userId = LoginInfo.userId
        jqpost(serverconfig.interface.queryCaseRepairDetail, pa, true, function(data) {
            var res = data.caseInfos[0];
            registinfoid = res.registinfoid;
            factorycode = res.factorycode;
            wishgoflag = res.wishgoflag;
            var factoryInfo = data.caseInfos[0].factorybasicinfoDto;
            var ele = $(".tableInfo tr td");
            // var statusBtn = res.statusBtns.split(',');


            ele.each(function(i, e) {
                var id = $(this).attr('id');
                if (id) {
                    $(this).text(res[id] || '暂无')
                }
            });

            if (res.thirdflag != '1') { //三者车
                $("#carTypeName").empty();
                $("#carTypeName").append('<td>送修状态</td><td id="arriveStatusDesc">' + res.arriveStatusDesc + '</td>' + '<td>客户姓名</td><td>' + res.reportorname + '</td><td>客户电话</td><td>' + res.reportorphone + '</td>');
            } else {
                $("#carTypeName").append('<td>送修状态</td><td id="arriveStatusDesc">' + res.arriveStatusDesc + '</td>');
            }
            $("#repairInfoTable").empty();
            if (res.sendRepairResults.length > 0) {
                var sendRepairResults = res.sendRepairResults;
                var html = '';
                for (var i = 0; i < sendRepairResults.length; i++) {
                    html += '<div class="tableInfo repairInfo">';
                    html += ' <table class="layui-table ">'
                    html += '<tbody>';
                    html += '<tr>';
                    html += '<td style="width:100px;" class="green">来源</td>';
                    html += '<td class="green" style="width:100px">' + sendRepairResults[i].sourceFlagDesc + '</td>';
                    if (sendRepairResults[i].wishgoflagDesc != "不显示") {
                        html += '<td style="width:80px;">送修意愿</td>';
                        html += '<td style="width:70px;">' + sendRepairResults[i].wishgoflagDesc + '</td>';
                    }
                    html += '<td>操作人姓名</td>';
                    html += '<td>' + sendRepairResults[i].operatorName + '</td>';
                    html += '<td>操作人电话</td>';
                    html += '<td>' + sendRepairResults[i].operatorPhone + '</td>';
                    // html += '</tr>';

                    // html += '<tr>';
                    html += '<td>修理厂代码</td>';
                    html += '<td>' + sendRepairResults[i].factorycode + '</td>';
                    html += '<td>联系电话</td>';
                    html += '<td>' + sendRepairResults[i].telephone + '</td>';
                    html += '</tr>';



                    html += '<tr>';
                    html += '<td>维修单位地址</td>';
                    html += '<td colspan="11">' + sendRepairResults[i].address + '</td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '<td>维修单位名称</td>';
                    html += '<td colspan="11">';
                    html += '<span style="margin-right: 50px; float: left;">' + sendRepairResults[i].factoryname + '</span>';
                    html += '<div class="statusBtn">';
                    html += '<button class="layui-btn layui-btn-sm refuseBtn ty" val="1" >同意</button>';
                    html += '<button class="layui-btn layui-btn-sm refuseBtn jjue" val="0" >拒绝</button>';
                    html += '<button class="layui-btn layui-btn-sm refuseBtn bmq" val="3" >不明确</button>';
                    html += '<button class="layui-btn layui-btn-sm refuseBtn bpf" val="4" >不赔付</button>';
                    html += '<div class="sxgp"><b></b>';
                    html += '<button class="layui-btn layui-btn-sm refuseBtn sxgpBtn" val="5" >送修改派</button></div>';
                    html += '</div>';
                    if (i == sendRepairResults.length - 1) {
                        html += '<div class="statusBtn1">';
                        html += '<button class="layui-btn layui-btn-sm statusFeedback ydd" val="2">已到店</button>';
                        html += ' <button class="layui-btn layui-btn-sm statusFeedback yls" val="3">已流失</button>';
                        html += ' <button class="layui-btn layui-btn-sm statusFeedback gzsf" val="4">跟踪随访</button>';
                        html += ' </div>';
                    }
                    html += '</td>';
                    html += '</tr>';
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';


                }
                $("#repairInfoTable").append(html);
                $("#repairInfo").show();
            }
            /**
             * 送修状态操作
             */
            $(".statusFeedback").on('click', function() {
                var val = $(this).attr('val');
                var desc = $(this).text();
                if (val == '3') {
                    $("#enterINfo").show();
                } else {
                    $("#enterINfo").hide();
                    parent.layer.open({
                        title: '提示',
                        maxmin: false,
                        type: 1,
                        moveType: 0,
                        content: '<div style="padding: 20px 60px;">确认' + desc + '</div>',
                        btn: ['确定', '取消'],
                        yes: function(index) {
                            var par = {
                                id: id,
                                userId: LoginInfo.userId,
                                arriveStatus: val,
                                receiverId: LoginInfo.userId
                            };
                            jqpost(serverconfig.interface.updateCaseInfo, par, true, function(data) {
                                if (data.status == 1) {
                                    parent.layer.close(index);
                                    parent.layuimini.msg_success('操作成功');
                                    searchDetail();
                                    repairecord();
                                }
                            });
                        }
                    });
                }

            });

            // 按钮展示隐藏
            if (res['ty'] == true) {
                $(".ty").show();
            }
            if (res['jj'] == true) {
                $(".jjue").show();
            }
            if (res['bmq'] == true) {
                $(".bmq").show();
            }
            if (res['bpf'] == true) {
                $(".bpf").show();
            }
            if (res['sxgp'] == true) {
                $(".sxgp").show();
                $(".sxgp button").show();
            }
            if (res['ydd'] == true) {
                $(".ydd").show();
            }
            if (res['yls'] == true) {
                $(".yls").show();
            }
            if (res['gzsf'] == true) {
                $(".gzsf").show();
            }

            if (!res.canGuide) { //不可以引导送修
                $("#secondRepair").hide();
            } else if (res.canGuide) { //可以引导送修
                //有修理厂则展示意愿反馈按钮，否则不展示直接弹出二次送修操作界面
                $("#secondRepair").show();
                if (!flag) {
                    var _offset = $("#secondRepair").offset().top;
                    $("#secondRepair").css('minHeight', _offset + 100);
                    $('body,html').animate({ 'scrollTop': _offset - 10 }, 300);
                }

            }

            $(".refuseBtn").on('click', function() {
                var val = $(this).attr('val');

                if (val == '1') {
                    $("#secondRepair").hide();
                    parent.layer.open({
                        title: '提示',
                        maxmin: false,
                        type: 1,
                        moveType: 0,
                        content: '<div style="padding: 20px 40px;">确认同意前往：' + factoryInfo.factoryname + ' ？</div>',
                        btn: ['确定', '取消'],
                        yes: function(index) {
                            var par = {
                                id: id,
                                userId: LoginInfo.userId,
                                accountType: LoginInfo.accountType,
                                wishFlag: 1,
                                registinfoid: registinfoid,
                                factorycode: res.factorycode
                            };
                            jqpost(serverconfig.interface.custWish, par, true, function(data) {
                                if (data.status == 1) {
                                    parent.layer.close(index);
                                    parent.layuimini.msg_success('操作成功');
                                    searchDetail();
                                    repairecord();
                                }
                            });
                        },
                        btn2: function(index, layero) {
                            var btnEle = $(".statusBtn").find('button');
                            btnEle.each(function() {
                                if ($(this).attr('val') != "1") {
                                    $(this).show();
                                }
                            })
                        },
                        cancel: function(index, layero) {
                            var btnEle = $(".statusBtn").find('button');
                            btnEle.each(function() {
                                if ($(this).attr('val') != "1") {
                                    $(this).show();
                                }
                            })
                        }
                    });
                } else if (val == '5') {
                    if (wishgoflag == "9") {
                        parent.layer.msg('请先反馈送修意愿');
                        return;
                    }
                    var pa = {
                        caseId: id,
                        registno: registno
                    }
                    parent.layer.open({
                        type: 2,
                        title: "选择机构",
                        area: ['650px', '80%'],
                        resize: false,
                        move: false,
                        content: 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairGpForm.html?' + getParam(pa)
                    });
                } else {
                    var par = {
                        id: id,
                        userId: LoginInfo.userId,
                        accountType: LoginInfo.accountType,
                        wishFlag: val,
                        registinfoid: registinfoid,
                        factorycode: factorycode
                    };
                    parent.layer.open({
                        title: '提示',
                        maxmin: false,
                        type: 1,
                        moveType: 0,
                        content: '<div style="padding: 20px 40px;">确认提交意愿反馈？</div>',
                        btn: ['确定', '取消'],
                        yes: function(index) {
                            jqpost(serverconfig.interface.custWish, par, true, function(data) {
                                if (data.status == 1 && res.resourceflag == "1") { //resourceflag 0 公共资源 1承保资源  承保资源不进行二次送修
                                    parent.layer.close(index);
                                    parent.layuimini.msg_success('意愿反馈成功！');
                                    repairecord();
                                    searchDetail();
                                } else {
                                    parent.layer.close(index);
                                    parent.layuimini.msg_success('意愿反馈成功！');
                                    setTimeout(function() {
                                        flag = false;
                                        btnhideOrshow();
                                        searchDetail();
                                        repairecord();
                                        // $("#secondRepair").show();

                                    }, 2000);

                                }
                            });
                        }
                    });
                }
            });
        });
    }
    searchDetail();

    function btnhideOrshow() {
        var btnEle = $(".statusBtn").find('button');
        btnEle.each(function() {
            if ($(this).attr('val') != "1") {
                $(this).hide();
            }
        })
    }

    function tableFun() {
        table.render({
            elem: '#factoryTable',
            url: serverconfig.baseurl + serverconfig.interface.queryFactoryInfo,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                comcode: LoginInfo.comCode,
                queryCondition: $('#factoryAddress').val(),
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
                    { field: 'factoryname', title: '修理厂名称', fixed: 'left' },
                    { field: 'address', title: '修理厂地址' },
                    { field: 'telephone', title: '修理厂电话' },
                    { field: 'right', width: 100, title: '操作', toolbar: '#barBtn', fixed: 'right' }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }


    function tableFun1(orgId) {
        // var comCode = $("#orgId option:selected").attr('comcode');
        // if (comCode == undefined) {
        //     comCode = LoginInfo.comCode
        // }
        table.render({
            elem: '#factoryTable1',
            url: serverconfig.baseurl + serverconfig.interface.queryOrgFactoryInfo,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                orgId: orgId,
                queryCondition: $('#factoryAddress1').val(),
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
                    { field: 'factoryname', title: '修理厂名称', fixed: 'left' },
                    { field: 'address', title: '修理厂地址' },
                    { field: 'telephone', title: '修理厂电话' },
                    { field: 'right', width: 100, title: '操作', toolbar: '#barBtn1', fixed: 'right' }
                ]
            ],
            done: function(res) {
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });
    }

    table.on('tool(factoryTable)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "select") {
            parent.layer.open({
                title: '提示',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 40px;">确认同意前往：' + datas.factoryname + ' ？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var par = {
                        id: id,
                        userId: LoginInfo.userId,
                        accountType: LoginInfo.accountType,
                        wishFlag: 1, //tong yi
                        registinfoid: registinfoid,
                        factorycode: datas.factorycode
                    };
                    jqpost(serverconfig.interface.custWish, par, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('操作成功');
                            searchDetail();
                            repairecord();
                        }
                    });
                }
            });

        }
    });

    table.on('tool(factoryTable1)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == "select1") {
            parent.layer.open({
                title: '提示',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 40px;">确认同意前往：' + datas.factoryname + ' ？</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    var par = {
                        id: id,
                        userId: LoginInfo.userId,
                        accountType: LoginInfo.accountType,
                        wishFlag: 1, //tong yi
                        registinfoid: registinfoid,
                        factorycode: datas.factorycode
                    };
                    jqpost(serverconfig.interface.custWish, par, true, function(data) {
                        if (data.status == 1) {
                            parent.layer.close(index);
                            parent.layuimini.msg_success('操作成功');
                            searchDetail();
                            repairecord();
                        }
                    });
                }
            });

        }
    });




    //查询流失信息
    function queryLossInfo() {
        var comCode = $("#orgId option:selected").attr('comcode');
        if (comCode == undefined) {
            comCode = LoginInfo.comCode
        }
        table.render({
            elem: '#losssInfoTable',
            url: serverconfig.baseurl + serverconfig.interface.queryLossInfo,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                caseId: id
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
                    { field: 'factoryName', title: '流失去向', fixed: 'left' },
                    { field: 'lossReason', title: '流失原因' },
                    { field: 'otherDesc', title: '非合作维修单位' },
                    { field: 'createTime', title: '送修时间' },
                    { field: 'right', width: 100, title: '操作', toolbar: '#losssInfoBtn', fixed: 'right' }
                ]
            ],
            done: function(res, curr, count) {
                if (res.list.length > 0) {
                    $("#losssInfoBox").show();
                }
                if (res.status == 3) {
                    window.location = '/login.html';
                }
            }
        });

    }
    queryLossInfo();

    table.on('tool(losssInfoTable)', function(obj) {
        var event = obj.event;
        var datas = obj.data;
        if (event == 'alter') {
            var obj = {
                id: id,
                userId: datas.userId,
                factoryName: datas.factoryName,
                factorycode: datas.factorycode,
                lossReason: datas.lossReason,
                otherDesc: datas.otherDesc
            }
            parent.layer.open({
                type: 2,
                title: "修改流失信息",
                area: ['50%', '70%'],
                resize: false,
                move: false,
                content: 'piccSxHtml/caseManageConfig/caseRepairManage/alterForm.html?' + getParam(obj),
            });
        } else if (event == 'deleter') {
            //以后操作，暂时不给删
            parent.layer.open({
                title: '提示',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">确认删除?</div>',
                btn: ['确定', '取消'],
                yes: function(index) {
                    jqpost(serverconfig.interface.deleteLossInfo, { id: id }, true, function(data) {
                        if (data.status == 1) {

                        }
                    });
                }
            });
        }

    });

    //流失字典
    function lossInfoDictionary() {
        jqpost(serverconfig.interface.queryLossDic, {}, true, function(data) {
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var html = "";
                html += "<li>";
                html += list[i];
                html += "</li>";
                $(".lossList ul").append(html);
            }
            $(".lossList ul li").on("click", function() {
                var text = $(this).text();
                $(".lossReason").val(text);
                $(".lossList").hide();
            })
        });
    }
    lossInfoDictionary();

    $(".lossReason").on('click', function() {
        $(".lossList").slideToggle(50);
    });


    //修理厂
    function repairComFun() {
        var pa = {};
        if (LoginInfo.comCode) {
            pa.comcode = LoginInfo.comCode;
        }
        jqpost(serverconfig.interface.queryFactoryInfo, pa, true, function(data, status, xhr) {
            var daObj = data.list;
            if (daObj) {
                for (var i = 0; i < daObj.length; i++) {
                    $("#repairCompany").append("<option value='" + daObj[i].factorycode + "' factoryname='" + daObj[i].factoryname + "' comCode='" + daObj[i].comcode + "'>" + daObj[i].factoryname + "</option>");
                };
                form.render();
            }
        });
    }
    repairComFun();



    //录入流失信息
    form.on('submit(submit)', function(data) {
        parent.layer.open({
            title: '提示',
            maxmin: false,
            type: 1,
            moveType: 0,
            content: '<div style="padding: 20px 60px;">确认提交?</div>',
            btn: ['确定', '取消'],
            yes: function(index) {
                data.field.caseId = id;
                data.field.userId = LoginInfo.userId;
                data.field.factoryName = $("#repairCompany option:selected").attr('factoryname');

                if (data.field.factoryName == undefined) {
                    data.field.factoryName = "";
                }
                jqpost(serverconfig.interface.addLossInfo, data.field, true, function(data) {
                    if (data.status == 1) {
                        $("#enterINfo").hide();
                        var par = {
                            id: id,
                            userId: LoginInfo.userId,
                            arriveStatus: 3,
                            receiverId: LoginInfo.userId
                        };
                        jqpost(serverconfig.interface.updateCaseInfo, par, true, function(data) {
                            if (data.status == 1) {
                                parent.layer.close(index);
                                parent.layuimini.msg_success('操作成功');
                                searchDetail();
                                repairecord();
                                queryLossInfo();
                            }
                        });
                    }
                });
            }
        });
        return false;
    });

    //送修记录
    function repairecord() {
        table.render({
            elem: '#repairRecordTable',
            url: serverconfig.baseurl + serverconfig.interface.querySendRepairOperLog,
            method: "POST",
            headers: { token: cookie.get("tokenKey") },
            contentType: "application/json; charset=utf-8",
            where: {
                isPage: "1",
                caseId: id,
            },
            request: {
                pageName: 'startPage',
                limitName: 'pageSize'
            },
            page: true,
            limit: 10,
            response: {
                statusName: 'status',
                statusCode: 1,
                msgName: 'info',
                countName: 'count',
                dataName: 'list'
            },
            cols: [
                [
                    { field: 'operatorName', title: '操作人姓名', },
                    { field: 'userCode', title: '操作人工号', },
                    { field: 'phone', title: '操作人电话', },
                    {
                        field: 'operDesc',
                        title: '操作描述'
                    },
                    { field: 'operateTime', title: '操作时间', }
                ]
            ],
            done: function(res, curr, count) {
                if (res.list.length > 0) {
                    $("#repairRecord").show();
                }
            }
        });
    }
    repairecord();

    $(".addressBtn").on('click', function() {
        $(".addressSearch").show();
        $(".orgSearch").hide();
    });

    $(".orgBtn").on('click', function() {
        $(".addressSearch").hide();
        $(".orgSearch").show();
    });

    $(".search-btn").on('click', function() {
        tableFun();
    });
    $(".org-search-btn").on('click', function() {
        if (!$("#orgId").val()) {
            parent.layuimini.msg_error('请选择组织机构');
            return;
        }
        tableFun1(checkOrgId);

    });
    $(".clear-btn").on('click', function() {
        $("#factoryAddress").val('');
        form.render();
        tableFun();
    });
    $(".clear-btn1").on('click', function() {
        $("#orgId").val('');
        $("#factoryAddress1").val('');
        form.render();
        tableFun1();
    });

    // 组织机构
    function search() {
        par.orgId = LoginInfo.orgId;
        par.levelFlag = 2;
        par.orgType = '1';
        delete par.tokenId;
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
                    html += '<td style="width:50px;"><button   comCode="' + da[i].comCode + '" orgId="' + da[i].orgId + '" orgName="' + da[i].orgName + '" class="layui-btn layui-btn-sm selectBtn" >选择</button>';
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
    search();

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
                        html += '<td style="width:50px;"><button  comCode="' + da[i].comCode + '" orgId="' + da[i].orgId + '" orgName="' + da[i].orgName + '" class="layui-btn layui-btn-sm selectBtn" >选择</button>';
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

    $(".operaterbtn").on('click', function() {
        var text = $(this).val();
        if (text == "0") {
            $(".downShow").show();
            $(".upHidden").hide();
            $("#secondRepair").css('minHeight', 'auto');
        } else {
            $(".upHidden").show();
            $(".downShow").hide();
            var _offset = $("#secondRepair").offset().top;
            $("#secondRepair").css('minHeight', _offset + 100);
            $('body,html').animate({ 'scrollTop': _offset - 10 }, 300);

        }
        $(".repairStyle").slideToggle(10);
    })

});