layui.use(['form', 'layer', 'layuimini'], function() {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table,
        $ = layui.jquery;


    $("#importRepairs").on('click', function() {
        var fileObj = document.getElementById("file").files[0];
        var formData = new FormData();
        if (!fileObj) {
            parent.layuimini.msg_error('请选择文件');
            return;
        }
        formData.append('file', fileObj);
        $.ajax({
            url: serverconfig.baseurl + serverconfig.interface.uploadFacUser,
            type: "post",
            data: formData,
            contentType: false,
            processData: false,
            headers: { token: cookie.get("token") },
            mimeType: "multipart/form-data",
            success: function(data) {
                if (data) {
                    var datas = JSON.parse(data);
                    if (datas.status == 1) {
                        parent.layuimini.msg_success('导入成功');
                        setTimeout(function() {
                            //刷新
                            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                            //关闭
                            parent.layer.closeAll();
                        }, 1000);
                    }
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    });

});