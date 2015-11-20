var _nologin= 0;
var baseDomain="http://zn.test.com/";
var basepath="/";
var jump_baseurl="main.html";
var thumb_img=null;
var statusBarBackground='#f7f7f7';
var noavatar_img=baseDomain+"/Public/Images/no_avatar.jpg";
var max_uploads_images=3;
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
var regBox = {
        regmcode : /^[0-9_-]{6}$/,//验证码
        regName : /^[0-9_-]{6}$/,//用户名
        regMobile : /^0?1[3|4|5|6|8][0-9]\d{8}$/,//手机
 }
//引用其他css 样式表
document.write("<link href=\""+baseDomain+"Public/css/style.css\" rel='stylesheet' />");