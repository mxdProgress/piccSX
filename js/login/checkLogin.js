var par = {
    tokenId: cookie.get("tokenKey")
};
var data = JSON.parse(sessionStorage.getItem('sessionObj'));
if (data) {
    var navs = data.detail.maintenanceTree.children;
} else {
    console.log('checkLoginjs提示1');
    if (window.top !== window.self) {
        window.location = '../../../login.html';
    } else {
        window.location = '../../../login.html';
    }
}


layui.use(['element', 'layer', 'layuimini'], function() {
    var $ = layui.jquery,
        element = layui.element,
        layer = layui.layer;
    // layuimini.init('api/init.json');

    // console.log(data);
    // navs.push({
    //     "title": "菜单管理",
    //     "href": "piccSxHtml/systemConfig/menuManage/menuManageList.html",
    //     "icon": "fa fa-window-maximize",
    //     "target": "_self"
    // })
    if (checkCommonRoleList('ercisongxiugang') || checkCommonRoleList('songxiugenzonggang') || checkCommonRoleList('yicisongxiugang')) {
        layuimini.addTab('piccSxHtml/caseManageConfig/caseRepairManage/caseRepairList.html?mpi=m-p-i-1', 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairList.html', '案件送修', true);
        element.tabChange('layuiminiTab', 'piccSxHtml/caseManageConfig/caseRepairManage/caseRepairList.html?mpi=m-p-i-1');
    }

    if (navs && navs.length > 0) {
        var menu = {
            "currency": {
                "title": "常规管理",
                "icon": "fa fa-address-book",
                "child": navs
            },
            "component": {
                "title": "组件管理",
                "icon": "fa fa-lemon-o",
                "child": [{}]
            },
            "other": {
                "title": "其它管理",
                "icon": "fa fa-slideshare",
                "child": [{}]
            }
        }
    }
    layuimini.init(menu);

    $(".modify-pass").on('click', function() {
        layer.open({
            type: 2,
            title: "修改密码",
            area: ['600px', '350px'],
            content: ['../../piccSxHtml/common/xiugaimima.html', 'no']
        });
    });



    jqpost(serverconfig.interface.userGetUserByToken, par, true, function(data) {
        if (data.status == 1) {
            var loginUserInfo = data.userInfo;
            $(".usernameText").text(loginUserInfo.userName + " ");
            $(".name").text(" " + loginUserInfo.realName);
        } else {
            window.location = '../../../login.html';
            console.log('checkLoginjs提示2');

        }
    }, function(data) {
        window.location = '../../../login.html';
        console.log('checkLoginjs提示3');
    })

    $('.login-out').on("click", function() {
        // layer.msg('退出登录成功', function() {
        cookie.del("tokenKey");
        window.location = './login.html';
        // });
    });
});