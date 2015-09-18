//*必须底部加载...
function heart() {
		//获得登陆状态

		//短信数量
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=heart_time",
			success: function(json) {
				var msg = eval(json);
				if (msg.sms_num > 0) {
					Zepto('#sms_num').html("<span class='mui-badge'>" + msg.sms_num + "</span>");
				}
			},
		});
		//  console.log(plus.storage.getItem("$user"));

	}
	//首页获得信息

function get_index() {
	mui.ajax({
		type: 'GET',
		dataType: 'json',
		url: baseDomain + "index.php?g=Api&m=Index&a=get_index",
		data: '',
		success: function(json) {
			Zepto('#hotdoclist').html("");
			var msg = eval(json);
			var hotdocilst = '';
			if (msg.code == 200) {
				Zepto.each(msg.recdoc, function(i, m) {
					hotdocilst = '<a href="app/show_detail.html"  open-type="common"  islogin="0" open-uid="' + m.id + '" open-title="' + m.title + '">';
					hotdocilst += '<li class="oa-contact-avatarindex">';
					if (m.thumb != '') thumb_img = baseDomain + m.thumb;
					else thumb_img = noavatar_img;
					hotdocilst += '<img src="' + thumb_img + '"  class="icon_avatar"  />';
					hotdocilst += '<p>' + m.title + '</p></li></a>';
					Zepto('#hotdoclist').append(hotdocilst);
				});

			}
			//重置页面内容
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			plus.nativeUI.toast(mylang['error_network']);
			console.log(JSON.stringify(xhr));
		}
	});
};
//消息获得信息
function get_sms() {
	var _userinfo = plus.storage.getItem("$user") || "{}";
	_userinfo = JSON.parse(_userinfo);
	_nologin = _userinfo.userid;
	var page = Zepto('#page').val(),
		cid = Zepto('#cid').val();
	Zepto('#page').val(parseInt(page) + 1);
	var smslist = "";
	var str = "";
	var status = null;
	mui.ajax({
		type: 'GET',
		dataType: 'json',
		url: baseDomain + "index.php?g=Api&m=Index&a=get_sms&uid=_nologin",
		data: 'p=' + page,
		success: function(json) {
			var msg = eval(json);
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, m) {
					if (parseInt(m.status) <= 0) status = "<font color='red'>[未读]</font>";
					else status = "[已读]";
					str = '<li class="mui-table-view-cell" title="' + m.id + '">';
					str += '<div class="mui-slider-right mui-disabled">';
					str += '<span class="mui-btn mui-btn-red ">删除</span>';
					str += '</div>';
					str += '<div class="mui-slider-handle sms_list"  open-linkid="' + m.linkid + '" open-mid="' + m.id + '">';
					str += '<span class="oa-contact mui-h6">' + status + m.content + '</span>';
					str += '<span class="oa-time mui-h6"  >' + m.createtime + '</span>';
					str += '</div>';
					str += '</li>';
					Zepto('#smslist').append(str);

				});
				//Zepto('#nologin').val(msg.nologin);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
				//Zepto('#smslist').html('没有信息了');
			}
			//重置页面内容
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
			//alert(type);
		}
	});
};


function get_notime() {
	var today = new Date();
	var y = today.getFullYear();
	var m = today.getMonth();
	var d = today.getDate();
	//var h=today.getHours();
	//var i=today.getMinutes();
	//var s=today.getSeconds();
	document.write(y + "年" + m + "月" + d + "日");
}

function set_time() {
	time = time - 1;
	if (time > 0) {
		Zepto('#mobile_auth').hide();
		Zepto('#mobile_auth_waitting').html('请等待' + time + '秒').show();
	} else {
		Zepto('#mobile_auth').show();
		Zepto('#mobile_auth_waitting').hide();
	}
}

function checklogin() {

	if (typeof(_nologin) == "undefined") _nologin = 0;
	/*mui.ajax({
		type: 'POST',
		dataType: 'json',
		url: baseDomain + "index.php?g=Api&m=Index&a=checklogin",
		success: function(json) {
			var msg = eval(json);
			if (msg.userid > 0) {
				//已登陆 显示退出
				_nologin=msg.userid;
			} else {
				_nologin=0;
			}

		}
	});
*/
	if (_nologin <= 0) {
		plus.nativeUI.toast('您尚未登陆!');
		mui.openWindow({
			url: basepath + 'login.html',
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

function setmark(new_string) {
	var n_name = new_string.slice(2, 4);
	new_string = new_string.replace(n_name, "***");
	return new_string;
}

function refresh(tid) {
	var list = plus.webview.getWebviewById(tid);
	list.reload(true);
}

function appendFile(path, uid, linkid, attrid) {

	var img = new Image();
	img.src = path;
	img.onload = function() {
		var that = this;
		//生成比例
		var w = that.width,
			h = that.height,
			scale = w / h;

		w = 480 || w; //480  你想压缩到多大
		h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //1z 表示图片质量，越低越模糊。
		/*files.push({
			name: "file" + index,
			pic: base64
		}); // 把base64数据丢进数组，上传要用。
		index++;
		*/
		var url = baseDomain + 'index.php?g=Api&m=Index&a=reply';
		var dataType = 'json';

		var data = {
			uid: uid, //回复用户对象
			linkid: linkid, //病例主体
			attrid: attrid, //回复的信息id
			pics: base64,
			blsm: '图像',
			msg_type: 'image'
		};
		mui.post(url, data, function(info) {
			plus.nativeUI.closeWaiting();
			var jsonList = eval("(" + info + ")");
			if (jsonList.code == 200) {
				plus.nativeUI.toast(jsonList.info);
			} else {
				plus.nativeUI.toast(jsonList.info);
			}
			//刷新	
		});

		//var pic = document.getElementById("x");
		//pic.src = base64;   //这里丢到img 的 src 里面就能看到效果了
	}
}

function upload_avatar(path) {
	var img = new Image();
	img.src = path;
	img.onload = function() {
		var that = this;
		//生成比例
		var w = that.width,
			h = that.height,
			scale = w / h;

		w = 120 || w; //480  你想压缩到多大
		h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //1z 表示图片质量，越低越模糊。
		/*files.push({
			name: "myavatar",
			pic: base64
		}); // 把base64数据丢进数组，上传要用。
		*/
		var pic = document.getElementById("avatar");
		pic.src = base64; //这里丢到img 的 src 里面就能看到效果了
		//files['pic']=base64;
		//alert(base64);
		var _userinfo = plus.storage.getItem("$user") || "{}";
			_userinfo = JSON.parse(_userinfo);
			_nologin = _userinfo.userid;
		var url = baseDomain + 'index.php?g=Api&m=Index&a=upload_avatar';
		var dataType = 'json';
		var data = {
			pics: base64,
			uid: _nologin,
		};
		mui.post(url, data, function(info) {
			plus.nativeUI.closeWaiting();
			var jsonList = eval("(" + info + ")");
			if (jsonList.code == 200) {
				plus.nativeUI.toast(jsonList.info);
			} else {
				plus.nativeUI.toast(jsonList.info);
			}
			//刷新	
		});

	}
}


function fav_more() {
		var _userinfo = plus.storage.getItem("$user") || "{}";
	_userinfo = JSON.parse(_userinfo);
	_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=favourite_list&uid=_nologin",
			data: 'p=' + page,
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, m) {
						var str = '';
						str += '<a href="show_detail.html" open-type="common" open-uid="' + m.id + '" open-title="' + m.title + '">';
						str += '<div class="mui-slider-cell">';
						str += '<div class="oa-contact-cell mui-table " style="padding:5px;padding-left:10px">';
						str += '<div class="oa-contact-avatar mui-table-cell">';
						if (m.thumb != '') thumb_img = baseDomain + m.thumb;
						else thumb_img = noavatar_img;
						str += '<img src="' + thumb_img + '" width="60" height="60" />';
						str += '</div>';
						str += '<div class="mui-table-cell">';
						str += '<div class="mui-clearfix">';
						str += '<h4 class="oa-contact-name">' + m.title + '</h4>';
						str += '<span class="mui-h6">[' + m.keshi + ']' + m.jibie + '</span>';
						str += '</div>';
						str += '<p class="mui-h6">' + m.description + '</p>';
						str += '</div>';
						str += '</div>';
						str += '</div></a>';
						Zepto('.list').append(str);
					});
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				console.log(JSON.stringify(xhr));
			}
		});

	}
	//setInterval("heart()", 5000);