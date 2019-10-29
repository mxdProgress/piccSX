cookie = {
    set: function(name, value, days) { //设置cookie方法
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    get: function(name) { //获取cookie方法
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return false;
    },
    del: function(key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString(); //设置cookie
    }
}

String.prototype.startWith = function(str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function(str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}


function jqpost(url, par, tokenflag, successfuction, errorfuction, operationobj, isHttp) {
    var layer = layui.layer;
    $ = layui.jquery;
    if (typeof(successfuction) != "function") {
        successfuction = sucessfunction;
    }
    if (typeof(errorfuction) != "function") {
        errorfuction = errorfunction;
    }
    if (!url.startWith("http")) {
        if (isHttp) {
            url = serverconfig.baseurlHttp + url;
        } else {
            url = serverconfig.baseurl + url;
        }
    }

    var loading = parent.layer.load(2, { shade: false });
    var aa = {
        type: "POST",
        url: url,
        data: JSON.stringify(par),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function(data, status, xhr) {
            parent.layer.close(loading);
            if (data.status == 1 || data.errorCode == 0) {
                successfuction(data, status, xhr, operationobj);
                if (operationobj) {
                    refreshfunction(operationobj);
                }
            } else {
                errorfuction(data, status, xhr, operationobj);
            }
        },
        error: function(data, status, xhr) {
            parent.layer.close(loading);
            if (operationobj && operationobj.noopenerrormsg) {
                return;
            } else {
                parent.layer.msg("接口访问失败");
            }

        }
    }
    if (tokenflag == true) {
        aa["headers"] = { token: cookie.get("token") }
    }
    $.ajax(aa);
}

function sucessfunction(data, status, xhr) {
    layer.msg('操作成功');
}

function refreshfunction(operationobj) {
    // if (operationobj.refreshName) {
    //     // 指定刷新的Tab页面，参数为title
    //     // window.parent.tab.refresh(operationobj.refreshName);
    // }
    // if (operationobj.refreshChangeName) {
    //     // 操作完后跳转页面
    //     // changeTabById(operationobj.refreshChangeName);
    // }
    // if (operationobj.refreshCloseName) {
    //     // 操作完后关闭页面
    //     // closeTab(operationobj.refreshBackName);
    // }
}

function errorfunction(data, status, xhr, operationobj) {
    if (data.status != null) {
        if (data.status == 2 || data.status == 3) {
            if (window.top !== window.self) {
                window.location = '../../../login.html';
            } else {
                window.location = '../../../login.html';
            }
        } else {
            parent.layer.open({
                title: '',
                maxmin: false,
                type: 1,
                moveType: 0,
                content: '<div style="padding: 20px 60px;">' + data.info + '</div>'
            });
        }
    }
}

//密码验证
function CheckPassWord(password) { //必须为字母加数字加特殊符号且长度不小于8位
    var reg = /^(?![0-9a-z]+$)(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\w]).{8,}$/
    return reg.test(password)

}
// 获取用户信息
function getLoginInfo() {
    var dddd = JSON.parse(sessionStorage.getItem('dddd'));
    return dddd.detail.user;
}


// 参数增加排序
function getdefaultparam() {
    var layer = layui.layer;
    $ = layui.jquery;
    var par = { isPage: "1", pageSize: pagesize, startPage: 1 };
    var px = $("#px");
    if (px) {
        var paixuziduan = $("#px").find("option:selected").attr("paixuziduan");
        par[paixuziduan] = $("#px").find("option:selected").attr("paixuziduanvalue");
    }
    return par;
}

// 页面检查权限
function checkPagePermissions($) {
    var aa = $("[customValidation]");
    for (var i = 0; i < aa.length; i++) {
        if (checkPermissions($(aa[i]).attr("customValidation"))) {
            $(aa[i]).show();
        }
    }
}

// 检查权限
function checkPermissions(permissions) {
    var dddd = JSON.parse(sessionStorage.getItem('dddd'));
    var permissionsist = permissions.split(',');
    for (var i in dddd.detail.maintenanceTargetList) {
        for (var j in permissionsist) {
            if (dddd.detail.maintenanceTargetList[i].funcCode == permissionsist[j]) {
                return true;
            }
        }
    }
    return false;
}

// 页面检查角色
function checkPageCommonRoleList($) {
    var aa = $("[customValidation]");
    for (var i = 0; i < aa.length; i++) {
        if (checkCommonRoleList($(aa[i]).attr("customValidation"))) {
            $(aa[i]).show();
        }
    }
}

// 检查角色
function checkCommonRoleList(Role) {
    var dddd = JSON.parse(sessionStorage.getItem('dddd'));
    var rolelist = Role.split(',');
    for (var i in dddd.detail.commonRoleList) {
        for (var j in rolelist) {
            if (dddd.detail.commonRoleList[i].commonRoleCode == rolelist[j]) {
                return true;
            }
        }
    }
    return false;
}

// 生成单位选择下拉框
function dgtree(orgId, da) {
    if (da == null || da.orgId == null) {
        return;
    }
    var tp = da.orgId.split("_");
    var lx = "";
    for (var i = 1; i < tp.length; i++) {
        lx = lx + "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    $("#" + orgId).append("<option comCode='" + da.comCode + "' value='" + da.orgId + "'>" + lx + da.orgName + "</option>");
    if (da.childList != null) {
        for (var i = 0; i < da.childList.length; i++) {
            dgtree(orgId, da.childList[i]);
        }
    }
}

// 动态生成选择下拉框
function dgongggongtree(da, selectname, idname, namename, comCode) {
    if (da == null || da[idname] == null) {
        return;
    }
    var tp = da[idname].split("_");
    var lx = "";
    for (var i = 1; i < tp.length; i++) {
        lx = lx + "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    $("#" + selectname).append("<option comcode='" + da[comCode] + "' value='" + da[idname] + "'>" + lx + da[namename] + "</option>");
    if (da.childList != null) {
        for (var i = 0; i < da.childList.length; i++) {
            dgongggongtree(da.childList[i], selectname, idname, namename, comCode);
        }
    }
}

// 生成单位选择下拉框
function getdgtree(orgId, callback) {
    jqpost(serverconfig.interface.orgGetOrgTree, { orgType: 1 }, true, function(data, status, xhr) {
        var da = data.detail;
        dgtree(orgId, da);
        if (typeof(callback) == "function") {
            callback();
        } else {
            layui.form.render();
        }
    });
}

// 生成公共选择下拉框
function getgonggongtree(interfacename, callback, selectname, idname, namename, comCode) {
    jqpost(interfacename, {}, true, function(data, status, xhr) {
        var da = data.detail;
        dgongggongtree(da, selectname, idname, namename, comCode);
        if (typeof(callback) == "function") {
            callback();
        } else {
            layui.form.render();
        }
    });
}
var formvalidator = {
    checkStrlength: function(val, opt) {
        val = val.trim();
        var len = $(opt).attr("wordsLength"); // 获取field中定义的字符长度
        if (sizeof(val) > Number(len)) {
            return "该输入项超长啦！";
        }
    },
    checkNumber: function(val, opt) {
        if (val == "") {
            return;
        }
        var tel = /^[0-9_]+$/;
        if (!tel.test(val)) {
            return "必须是数字";
        }
        var len = $(opt).attr("wordsLength"); // 获取field中定义的字符长度
        if (sizeof(val) > Number(len)) {
            return "该输入项超长啦！";
        }
    },
    checkPhone: function(val, opt) {
        var len = $(opt).attr("wordsLength");
        if (sizeof(val) != Number(len)) {
            return "手机号长度不够！";
        }
        if (!(/^1[3456789]\d{9}$/.test(val))) {
            return "手机号码有误，请重填！";
        }
    }
}

function sizeof(str, charset) {
    var total = 0,
        charCode, i, len;
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0xffff) {
                total += 2;
            } else {
                total += 4;
            }
        }
    } else {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
    }
    return total;
}
/**
 * 加载json的数据到页面的表单中，以name为唯一标示符加载
 * @param {String} jsonStr json表单数据
 */
function loadJsonDataToForm(jsonStr) {
    try {
        //var obj = eval("("+jsonStr+")");
        var obj = jsonStr;
        var key, value, tagName, type, arr;
        for (x in obj) {
            key = x;
            value = obj[x];

            $("[name='" + key + "'],[name='" + key + "[]']").each(function() {
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if (tagName == 'INPUT') {
                    if (type == 'radio') {
                        $(this).attr('checked', $(this).val() == value);
                    } else if (type == 'checkbox') {
                        arr = value.toString().split(',');
                        for (var i = 0; i < arr.length; i++) {
                            if ($(this).val() == arr[i]) {
                                $(this).attr('checked', true);
                                break;
                            }
                        }
                    } else {
                        $(this).val(value);
                    }
                } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                    $(this).val(value);
                }

            });
        }
    } catch (e) {
        console.log("加载表单：" + e.message + ",数据内容" + JSON.stringify(jsonStr));
    }
}
// 查询对象转URL参数
function getParam(obj) {
    var pa = '';
    for (var p in obj) { // 方法 
        if (typeof(obj[p]) == " function ") {
            //			obj[p]();
        } else { // p 为属性名称，obj[p]为对应属性的值 
            if (!isEmptyObject(obj[p])) {
                pa = pa + '&' + p + '=' + decodeURI(obj[p]);
            }
        }
    }
    return pa.substring(1, pa.length);
}
//判断是否为空对象
function isEmptyObject(obj) {
    if (obj === "" || obj == null || obj == undefined) {
        return true;
    }
    for (var n in obj) {
        return false
    }
    if (!isNaN(obj)) {
        return false
    }
    return true;
}
//把url的参数部分转化成json对象 
function getParamsFromURL() {
    var st = decodeURI(location.search);
    var s = st.length > 0 ? st.substring(1) : '';
    if (!s) return null;
    var args = {};
    var items = s.split('&');
    var item = null;
    for (var i = 0; i < items.length; i++) {
        item = items[i].split('=');
        args[item[0]] = item[1];
    }
    return args;
}
//用户信息
function loginInfo() {
    var loginInfo = JSON.parse(sessionStorage.getItem('dddd'));
    return loginInfo.detail.user;
}
//筛选后台null数据替换空字符串
function filterJsonObj(da) {
    if (da.length > 0) {
        for (var j = 0; j < da.length; j++) {
            for (keys in da[j]) {
                if (da[j][keys] == null) {
                    da[j][keys] = '无';
                }
            }
        }
    }
    return da
}

//获取当前日期
function getDate() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var now = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    return now;
}

//获取当前月的第一天
function getCurrentMonthFirst(dt) {
    var date;
    if (dt) {
        date = new Date(dt);
    } else {
        date = new Date();
    }
    var d = new Date(date.setDate(1));
    return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
}

//获取当前月的最后一天
function getCurrentMonthLast(dt) {
    var date;
    if (dt) {
        date = new Date(dt);
    } else {
        date = new Date();
    }
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var d = new Date(nextMonthFirstDay - oneDay);
    return d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
}