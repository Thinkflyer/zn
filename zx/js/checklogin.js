var _userinfo = plus.storage.getItem("$user") || "{}";
_userinfo = JSON.parse(_userinfo);
_nologin = _userinfo.userid;
function checklogin(){
	if(typeof(_nologin) == "undefined") _nologin=0;
	if (_nologin <= 0) {
		plus.nativeUI.toast('您尚未登陆!');
		mui.openWindow({
			url: basepath+'login.html',
			id: 'login',
			show: {
				aniShow: 'slide-in-bottom',
				duration: 300
			},
			styles: {
				zindex: 1,
			},
		});
		window.addEventListener("pageflowrefresh", function(e) {
			location.reload();
		});
		return false;
	} else {
		return true;
	}
}