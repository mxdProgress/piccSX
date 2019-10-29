var par = {
    tokenId: cookie.get("token")
};
var data = JSON.parse(sessionStorage.getItem('dddd'));
if (data) {
    var navs = data.detail.maintenanceTree.children;
} else {
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
            $(".usernameText").text(loginUserInfo.userName);
        } else {
            window.location = '../../../login.html';
        }
    }, function(data) {
        window.location = '../../../login.html';
    })

    $('.login-out').on("click", function() {
        layer.msg('退出登录成功', function() {
            cookie.del("token");
            window.location = './login.html';
        });
    });
});