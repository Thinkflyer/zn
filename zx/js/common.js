function heart() {
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
					hotdocilst = '<a href="app/show_detail.html"  open-type="common"  open-uid="' + m.id + '" open-title="' + m.title + '">';
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
	var page = Zepto('#page').val(),
		cid = Zepto('#cid').val();
	Zepto('#page').val(parseInt(page) + 1);
	var smslist = "";
	var str = "";
	var status = null;
	mui.ajax({
		type: 'GET',
		dataType: 'json',
		url: baseDomain + "index.php?g=Api&m=Index&a=get_sms",
		data: 'p=' + page,
		success: function(json) {
			var msg = eval(json);
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, m) {
					if (parseInt(m.status) <= 0) status = "<font color='red'>[未读]</font>";
					else status = "[已读]";
					//Zepto('#smslist').append(hotdocilst);
					str = '<li class="mui-table-view-cell" title="' + m.id + '">';
					str += '<div class="mui-slider-right mui-disabled">';
					str += '<span class="mui-btn mui-btn-red ">删除</span>';
					str += '</div>';
					str += '<div class="mui-slider-handle" >';
					str += '<a href="im-chat.html"  open-type="common" open-linkid="' + m.linkid + '" open-mid="' + m.id + '">';
					str += '<span class="oa-contact mui-h6">' + status + m.content + '</span>';
					str += '<span class="oa-time mui-h6"  >' + m.createtime + '</span>';
					str += '</a>';
					str += '</div>';
					str += '</li>';
					Zepto('#smslist').append(str);

				});
				Zepto('#nologin').val(msg.nologin);
				//alert(msg.sql);
				//console.log(msg.sql);
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
	var nologin = plus.storage.getItem('userid');
	if (nologin <= 0) {
		plus.nativeUI.toast('您尚未登陆!');
		mui.openWindow({
			url: 'login.html',
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
function setmark(new_string){
	var n_name=new_string.slice(2,4);
	new_string=new_string.replace(n_name,"***");
	return new_string;
}
function refresh(tid) {
	var list = plus.webview.getWebviewById(tid);
	list.reload(true);
}
setInterval("heart()", 5000);