var baseDomain="http://zn.didimama.com/";
var basepath="app/";
var thumb_img=null;
var statusBarBackground='#f7f7f7';
var noavatar_img=baseDomain+"/Public/Images/no_avatar.jpg";
var max_uploads_images=3;
/*提示翻译*/
var mylang={
		'error_network' : "网络异常,操作失败",
		'login_success' : "登陆成功",
		'upload_bl_success' :"病例上传成功 请耐心等待医生回复.",
}
var time=10;//验证码 延时
var mcro_time=1000;//毫秒
var regBox = {
        regmcode : /^[0-9_-]{6}$/,//验证码
        regName : /^[0-9_-]{6}$/,//用户名
        regMobile : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
 }