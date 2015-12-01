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

	/*记录当前语种信息*/
	owner.setLanguage = function(language, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		state.language = language;
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

	/**
	 * 获取默认选择的国家
	 **/
	owner.getLocal = function() {
		var localText = localStorage.getItem('$local') || "";
		if (localText == "") localText = "cn"; //默认设置为 中国  
		return JSON.parse(localText);
	};
	/**
	 * 设置选择的国家
	 **/
	owner.setLocal = function(state) {
		state = state || {};
		localStorage.setItem('$local', JSON.stringify(state));
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


	/*首页*/
	owner.add_more = function() {
		//*判断网络链接状态*/
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		//第一步 定义路径
		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=newslist&cid=" + cid + "&p=" + page;
		var msg = owner.getcache(_geturl);
		if (_isusecache && msg) {
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, v) {
					var str = '<li class="mui-table-view-cell li_list icon_' + v.catid + '" linkurl="detail.html" open-type="article" open-sid="' + v.id + '"  ><span>' + v.catname + '</span><h6 class="black_color s_strong">' + v.title + '</h6><h6 class="s_date">' + v.createtime + '</h6><p class="s_des">' + v.description + '</p></li>';
					Zepto('#newslist').append(str);
				});
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		} else {

			mui.ajax({
				timeout: 5000,
				type: 'GET',
				dataType: 'json',
				url: _geturl,
				//data: 'p=' + page,
				success: function(json) {
					//缓存数据 此处会移植到 批量中 测试使用
					owner.setcache(_geturl, json);
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							var str = '<li class="mui-table-view-cell li_list icon_' + v.catid + '" linkurl="detail.html" open-type="article" open-sid="' + v.id + '"  ><span>' + v.catname + '</span><h6 class="black_color s_strong">' + v.title + '</h6><h6 class="s_date">' + v.createtime + '</h6><p class="s_des">' + v.description + '</p></li>';
							Zepto('#newslist').append(str);
						});
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
				},
				error: function(xhr, type, errorThrown) {
					//if(type=='abort') alert(1);
					//异常处理；
					plus.nativeUI.toast(mylang['error_network']);
					console.log(JSON.stringify(xhr));
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
			});
		}
	}


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

		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=favourite_list&p=" + page;
		var msg = owner.getcache(_geturl);

		if (_isusecache && msg) {

			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, v) {
					var str = '<li class="mui-table-view-cell" linkurl="main.html"  open-sid="' + v.id + '"  ><a class="mui-navigate-right">' + v.localname + '</a>';

					Zepto('#newslist').append(str);
				});
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}


		} else {


			mui.ajax({
				timeout: 5000,
				type: 'GET',
				dataType: 'json',
				url: _geturl,
				//data: 'p=' + page,
				success: function(json) {
					owner.setcache(_geturl, json);
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							var str = '<li class="mui-table-view-cell" linkurl="main.html"  open-sid="' + v.id + '"  ><a class="mui-navigate-right">' + v.localname + '</a>';

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
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

				}
			});
		}

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
		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=newslist&cid=" + cid + "&p=" + page;
		var msg = owner.getcache(_geturl);
		if (_isusecache && msg) {
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, v) {
					var str = '<li class="mui-table-view-cell li_list icon_' + v.catid + '" linkurl="detail.html" open-type="article" open-sid="' + v.id + '"  ><span>' + v.catname + '</span><h6 class="black_color s_strong">' + v.title + '</h6><h6 class="s_date">' + v.createtime + '</h6><p class="s_des">' + v.description + '</p></li>';
					Zepto('#newslist').append(str);
				});
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		} else {
			mui.ajax({
				timeout: 5000,
				type: 'GET',
				dataType: 'json',
				url: _geturl,
				//			data: {
				//				cid: cid,
				//				p: page
				//			},
				success: function(json) {
					owner.setcache(_geturl, json);
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							var str = '<li class="mui-table-view-cell li_list icon_' + v.catid + '" linkurl="detail.html" open-type="article" open-sid="' + v.id + '"  ><span>' + v.catname + '</span><h6 class="black_color s_strong">' + v.title + '</h6><h6 class="s_date">' + v.createtime + '</h6><p class="s_des">' + v.description + '</p></li>';
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
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

				}
			});
		}
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
		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=hospital_list&cid=" + cid + "&p=" + page;
		var msg = owner.getcache(_geturl);
		if (_isusecache && msg) {
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, v) {
					var str = '<li class="mui-table-view-cell" linkurl="hospital_detail.html" open-type="hospital" open-sid="' + v.id + '"  ><a class="mui-navigate-right"><b>' + v.catname + '</b><span class="right_m" >' + v.local_id + '</span></a>';

					Zepto('#newslist').append(str);
				});
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		} else {
			mui.ajax({
				timeout: 5000,
				type: 'GET',
				dataType: 'json',
				url: _geturl,
				//			data: {
				//				cid: cid,
				//				p: page
				//			},
				success: function(json) {
					owner.setcache(_geturl, json);
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
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

				}
			});
		}
		plus.nativeUI.closeWaiting();
	}

	/**
	 *  取回语种信息
	 **/

	owner.get_language_info = function(callback) {


			var _geturl = baseDomain + "index.php?g=Api&m=Index&a=language_list";
			var msg = owner.getcache(_geturl);
			if (_isusecache && msg) {
				return callback(msg);
			} else {
				mui.ajax({
					timeout: 5000,
					type: 'GET',
					dataType: 'json',
					url: _geturl,
					success: function(json) {
						owner.setcache(_geturl, json);
						return callback(json);
						//var msg = eval(json);
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast(mylang['error_network']);

					}
				});
			}
			plus.nativeUI.closeWaiting();
		}
		/**
		 *  取回地区信息名称 //不缓存
		 **/
	owner.get_globallocalinfo = function() {
		var _checked=app.getLocal();
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val(),
			keyword = Zepto('#seach_local').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			timeout: 5000,
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=global_list",
			data: {
				cid: cid,
				p: page,
				keyword: keyword
			},
			success: function(json) {
				var bool="";
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						//if (_checked.indexOf(v.typeid +",")) bool='checked' else bool='';
						
						var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.typeid + '" >' + v.typeid + v.name + ' <input name="local_list" type="checkbox"  value="' + v.typeid +'></li>';
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
				//console.log(JSON.stringify(xhr));
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);


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


	/**
	 *  返回更新列表
	 **/


	owner.get_sync_info = function(self, callback) {
		var time = 10;
		mui.ajax({
			timeout: 5000,
			async: false,
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=sync_list",
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						var _requesturl = baseDomain + v; //需要缓存的地址
						mui.ajax({
							type: 'GET',
							dataType: 'json',
							async: false,
							url: _requesturl,
							success: function(json) {
								var msg = eval(json);
								if (msg.code == 200) {
									localStorage.setItem(md5(_requesturl), JSON.stringify(msg));
								}
							}
						});

					});
					//修改状态

				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//plus.nativeUI.toast(mylang['error_network']);
				//console.log(JSON.stringify(xhr));
				return callback(mylang['error_network'] + ',同步异常!');
			}
		});
		return callback();
	}



	/**
	 * 返回点中的内容
	 **/
	owner.retrun_checkboxed = function(obj, callback) {
		var str="";
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) str += obj[i].value + ','; //如果选中，将value添加到变量s中 
		}
		str = str.substring(0, str.length - 1); //返回点中的值
		return callback(str);
	}


	/**
	 * 读取离线缓存开
	 **/
	owner.getcache = function(_requesturl) {
		//alert(owner.getSettings);
		var settings = owner.getSettings();
		//alert(settings.autoSync);
		var offline_article = offline_article || {};
		var _md5_requesturl = md5(_requesturl); //请求地址格式化
		var articleinfo = localStorage.getItem(_md5_requesturl) || ''; //获取现有数据
		if (articleinfo && settings.autoSync) { //当缓存信息存在 并且启用缓存功能时有效.
			plus.nativeUI.toast('CacheData');
			var articleinfo = JSON.parse(articleinfo);
			return articleinfo;
		} else {
			plus.nativeUI.toast('AjaxData');

		}
	}


	/**
	 * 写入离线缓存
	 **/
	owner.setcache = function(_requesturl, json) {
		//alert(_requesturl);
		var settings = owner.getSettings();
		if (_isusecache && settings.autoSync) localStorage.setItem(md5(_requesturl), JSON.stringify(json));
	}
}(mui, window.app = {}));