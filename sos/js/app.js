(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

		if (loginInfo.account.length < 6) {
			return callback('用户名输入格式错误');
		}
		if (loginInfo.password.length < 4) {
			return callback('密码最短为 4 个字符');
		}



		var authed = 1; //为1 验证成功  0 验证失败
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}

	};

	owner.createState = function(name, token, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		state.account = name;
		state.token = token;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.auth = regInfo.auth || '';
		if (regInfo.auth.length < 4) {
			return callback('验证码位数不符');
		}

		if (regInfo.account.length < 11) {
			return callback('手机号码需要11个字符');
		}

		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}


		//var users = JSON.parse(localStorage.getItem('$users') || '[]');
		//users.push(regInfo);
		//localStorage.setItem('$users', JSON.stringify(users));

		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};


	var checkMobile = function(mobile) {
		mobile = mobile || '';
		return (mobile.length > 3 && email.indexOf('@') > -1);
	};
	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(account, auth, callback) {
		callback = callback || $.noop;
		if (!account) {
			return callback(0, '手机号码不能为空');
		} else if (account < 11) {
			return callback(0, '手机号码输入格式错误');
		} else if (!auth) {
			return callback(0, '验证码不能为空');

		} else {
			return callback(1);
		}


	};

	/**
	 *  取回保存国际
	 **/
	owner.get_countrylist = function() {
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=favourite_list",
			data: 'p=' + page,
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						var str = '<li class="mui-table-view-cell" linkurl="main.html"  open-sid="' + v.id + '"  ><a class="mui-navigate-right">' + v.title + '</a>';

						Zepto('#newslist').append(str);
					});
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				console.log(JSON.stringify(xhr));
			}
		});
		plus.nativeUI.closeWaiting();
	}


	/**
	 *  取回全球信息
	 **/
	owner.get_globalnewslist = function() {
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=newslist",
			data: {
				cid: cid,
				p: page
			},
			success: function(json) {
				var msg = eval(json);

				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						var str = '<li   class="mui-table-view-cell li_list "' + v.catid + '" linkurl="detail.html" open-type="article" open-type="article" open-sid="' + v.id + '"  >	<span class="mui-icon-' + v.catdir + ' mui-icon icon_title"></span><span>' + v.catname + '</span><h6 class="black_color s_strong">' + v.title + '</h6><h6 class="s_date">' + v.createtime + '</h6><p class="s_des">' + v.description + '</p></li>';
						Zepto('#newslist').append(str);
					});
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				console.log(JSON.stringify(xhr));
			}
		});
		plus.nativeUI.closeWaiting();
	}

	/**
	 *  取回诊所信息分类
	 **/
	owner.get_hospital_list = function() {
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=hospital_list",
			data: {
				cid: cid,
				p: page
			},
			success: function(json) {
				var msg = eval(json);

				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						var str = '<li class="mui-table-view-cell" linkurl="hospital_detail.html" open-type="hospital" open-sid="' + v.id + '"  ><a class="mui-navigate-right"><b>' + v.catname + '</b><span class="right_m" >' + v.local_id + '</span></a>';

						Zepto('#newslist').append(str);
					});
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				console.log(JSON.stringify(xhr));
			}
		});
		plus.nativeUI.closeWaiting();
	}


/**
	 *  取回地区信息名称
	 **/
	owner.get_globallocalinfo = function() {
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=global_list",
			data: {
				cid: cid,
				p: page
			},
			success: function(json) {
				var msg = eval(json);

				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.catid + '" >'+ v.catname+' <input name="checkbox" type="checkbox"></li>';
						Zepto('#newslist').append(str);
					});
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				console.log(JSON.stringify(xhr));
			}
		});
		plus.nativeUI.closeWaiting();
	}
	/**
	 * 找回密码
	 **/
	owner.submitPassword = function(password_1, password_2, callback) {
			callback = callback || $.noop;
			if (!password_1 || !password_2) {
				return callback(0, '重置密码不能为空');
			} else if (password_1 < 6) {
				return callback(0, '重置密码不能小于6位');
			} else if (password_1 != password_2) {
				return callback(0, '密码与确认密码不符');
			} else {
				return callback(1);
			}

		}
		/**
		 * 获取应用本地配置
		 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));