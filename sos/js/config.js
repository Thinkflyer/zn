var _isusecache= 1;//强制使用缓存数据当为0时 缓存将不自动写入
var _appid='cn.frun.assistance'; //fire刷新对应id修改
var _iscachemsg= 0;
var _avatar = "images/avatar.png";
var baseDomain="http://sos_server.didimama.com/";
var basepath="/";
var jump_baseurl="main.html";
var call_telphone= "0864009208876";
var version_number="1.0.1";
/*提示翻译*/
var mylang={
		'error_no_empty' : "此项不能为空",
		'error_city_empty' : "所属城市不能为空",
		'error_realname_empty' :"真实姓名不能为空",
		'error_pwd_empty' :"密码不能为空",
		'error_auth_empty' :"验证码不能为空",
		'error_auth_size' :"输入有误6位长度数字",
		'error_mobile_empty' :"手机号码不能为空",
		'error_mobile' :"手机号码有误",
		'error_network' : "网络异常,操作失败",
		'login_success' : "登陆成功",
		'error_empty' : "暂无内容",
}
var time=10;//验证码 延时
var mcro_time=1000;//毫秒
var showloading=true; //关闭过渡不会显示 loadding 
var regBox = {
        regmcode : /^[0-9_-]{6}$/,//验证码
        regName : /^[0-9_-]{6}$/,//用户名
        regMobile : /^0?1[3|4|5|6|8][0-9]\d{8}$/,//手机
 }
//引用其他css 样式表 注意上下顺序
document.write("<link href=\"css/mui.min.css\" rel='stylesheet' />");
document.write("<link href=\"css/ext.css\" rel='stylesheet' />");

//引入 md5  和 app.js
document.write("<script src=\"js/zepto.min.js\"></script>");
document.write("<script src=\"js/md5.min.js\"></script>");
document.write("<script src=\"js/mui.min.js\"></script>");
document.write("<script src=\"js/app.js?t="+Math.random()+"\"></script>");
