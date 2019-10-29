var through = require('through2');
var gutil = require('gulp-util');
var PLUGIN_NAME = 'lazyloadRev';
// 插件级别的函数（处理文件）
function lazyLoadRev(obj) {
  
  return through.obj(function (file, enc, cb) {

        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
        if (file.isNull()) {
            this.push(file);
            return cb();
        }
        // 插件不支持对 Stream 对直接操作，跑出异常
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var fileText = file.contents.toString();
        for(var key in obj){
            var toReplace = obj[key];
            fileText = fileText.replace(new RegExp("" + key + "", "g"), toReplace); 
        }
        file.contents = new Buffer(fileText);
        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);

        cb();
    });
};

// 导出插件主函数
module.exports = lazyLoadRev;