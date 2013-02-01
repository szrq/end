/**
 * author: mdemo
 * Date: 13-1-25
 * Time: 下午3:32
 * Desc: End.js javascript sdk
 */
(function () {
    var _vars = {
        socket:{}
    };
    var root = window;
    /**
     * End.js 数据构造器
     * @param route 数据路由地址 可为空，默认为data
     * @param url   后端数据服务地址 可为空 如果存在，将对webSocket进行初始化
     * @constructor
     */
    var End = function (route, url) {
        this.route = route || '';
        if (url) {
            _vars.socket = io.connect(url);
            _vars.socket.on('news', function (data) {
                _vars.socket.emit('my other event', {my:'data'},function(success){
                    console.log(success);
                });
            });
        }
    };
    root.End = End;
    /**
     * 根据路由，获取子元素
     * @param route 不可为空
     * @return 子元素实体
     */
    End.prototype.child = function (route) {
        return new End(this.route + '.' + route);
    };
    /**
     * 获取父元素
     * @return 父元素实体
     */
    End.prototype.parent = function () {
        var route = this.route.substring(0, this.route.lastIndexOf('.'));
        return new End(route);
    };
    /**
     * 数据处理通用方法
     * @param value 要处理的数据
     * @param method 方法类型
     * @param callback 回调函数
     */
    End.prototype.data = function(value,method,callback,options){
        var data = {};
        data.routes = this.route.split('.');
        data.value = value;
        data.method = method;
        if(options){
            data.options = options;
        }
        _vars.socket.emit('dal',data,function(returns){
            if(callback){
                callback(returns);
            }
        });
    };
    /**
     * collections元素添加
     * @param value 要添加的数据
     * @param callback 回调函数 成功返回id
     */
    End.prototype.insert = function(value,callback){
        this.data(value,'insert',callback);
    };
    /**
     * 添加或修改非数组数据
     * @param value 要添加的数据
     * @param callback 回调函数 会返回是否成功
     */
    End.prototype.set = function (value,callback) {
        this.data(value,'set',callback);
    };
    /**
     * 添加数组数据
     * @param value 要添加的数组元素
     * @param callback 回调函数 会返回是否成功
     */
    End.prototype.push = function(value,callback){
        this.data(value,'push',callback);
    };
    End.prototype.update = function (value,options,callback) {
        this.data(value,'update',callback,options);
    };
    End.prototype.on = function () {

    };

}());