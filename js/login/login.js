layui.use(['form'], function() {
    var form = layui.form,
        layer = layui.layer;

    // 登录过期的时候，跳出ifram框架
    if (top.location != self.location) top.location = self.location;

    // 粒子线条背景
    $(document).ready(function() {
        $('.layui-container').particleground({
            dotColor: '#4b9e8e',
            lineColor: '#4b9e8e'
        });
    });

    //图片验证码展示
    function getVerify() {
        jqpost(serverconfig.interface.getVerify, {}, true, function(data) {
            if (data.detail) {
                $(".captcha-img").empty();
                strkey = data.detail.strkey;
                var html = '';
                html += '<img id= "login_checkcode" src="data:image/png;base64,' + data.detail.imgStr + '" alt=\'看不清？点击刷新\' title=\'看不清？点击刷新\' style=\'cursor:pointer;border:1px #e6e6e6 solid;\'>';
                $(".captcha-img ").append(html);
            }
            $("#login_checkcode").on('click', function() {
                getVerify();
            });
        });
    }
    setTimeout(function() {
        getVerify();
    }, 100)

    if (cookie.get("ccccc") == 1) {
        $('#userName').val(cookie.get("aaaaa"));
        $('#password').val(cookie.get("bbbbb"));
        var rememberMe = document.getElementsByName('rememberMe');
        rememberMe[0].checked = true;
        form.render('checkbox');
    } else {
        var rememberMe = document.getElementsByName('rememberMe');
        rememberMe[0].checked = false;
        form.render('checkbox');
    }
    form.on('submit(login)', function(data) {
        var rememberMe = document.getElementsByName('rememberMe');
        if (rememberMe[0].checked) {
            cookie.set("aaaaa", $('#userName').val(), 30);
            cookie.set("bbbbb", $('#password').val(), 30);
            cookie.set("ccccc", 1, 30);
        } else {
            cookie.set("ccccc", 0, 30);
        }

        var par = {
            userName: $('#userName').val(),
            passWord: md5($('#password').val()),
            checkCode: $('#checkCode').val(),
            strKey: strkey
        };
        if (!$("#userName").val()) {
            layer.msg('用户名不能为空!!');
        } else if (!$("#password").val()) {
            layer.msg('密码不能为空');
        } else {
            jqpost(serverconfig.interface.login, par, null, successfuction, errorfunction);
        }

        function successfuction(data, status, xhr) {
            cookie.set("tokenKey", data.detail.user.token);
            sessionStorage.setItem('sessionObj', JSON.stringify(data));
            var psCheck = CheckPassWord($('#password').val());
            if (!psCheck) {
                layer.msg('密码必须为字母加数字加特殊符号且长度不小于8位');
                setTimeout(function() {
                    layer.open({
                        type: 2,
                        title: "修改密码",
                        area: ['600px', '350px'],
                        content: ['../../piccSxHtml/common/xiugaimima.html', 'no']
                    });
                }, 2000);
            } else {
                location.href = './index.html';
            }
        }

        function errorfunction(data, status, xhr) {
            var layer = layui.layer;
            layer.msg(data.info);
            getVerify();
        }
        return false;
    });
});