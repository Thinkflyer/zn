(function($, owner) {
	/*判断是否登陆状态*/
	owner.checklogin = function() {
		var loginInfo = owner.getCommon('loginInfo');
		var settings = owner.getSettings();
		//	if (!settings.autoLogin || !loginInfo.auth) { //保存密码 并有记录
		if (!loginInfo.auth) { //保存密码 并有记录
			//plus.webview.getWebviewById('HBuilder').hide();
			owner.toLogin();
		}
	};
	//跳转至登陆页面
	owner.toLogin = function() {
		//setTimeout(function() {
		mui.openWindow({
			id: 'IndexLogin',
			url: 'IndexLogin.html',
			show: {
				aniShow: 'pop-in',
			},
			waiting: {
				autoShow: false
			}
		});
		//}, 800);
	};


	/**
	 * 用户登录
	 **/
	//var _authed;
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.userid = loginInfo.userid || '';
		loginInfo.password = loginInfo.password || '';
		loginInfo.cardnumber = loginInfo.cardnumber || '';
		loginInfo.is_cardnumber = loginInfo.is_cardnumber;
		var _posturl = baseDomain + "index.php?g=Api&m=Index&a=ajaxlogin";
		if (loginInfo.is_cardnumber) {
			if (loginInfo.cardnumber.length != 12) {
				return callback('会员卡格式不符合');
			} else {
				//会员卡登陆方法
				mui.ajax({
					type: 'POST',
					dataType: 'json',
					url: _posturl,
					data: {
						cardnumber: loginInfo.cardnumber
					},
					success: function(json) {
						var msg = eval(json);
						if (msg.code <= 0) {
							return callback(msg.info);
						} else {
							//成功返回 保存
							loginInfo.account = msg.username;
							loginInfo.userid = msg.userid;
							loginInfo.auth = msg.auth;
							loginInfo.cardnumber = msg.cardnumber;
							owner.setCommon('loginInfo', loginInfo);
							return callback(0); //登陆成功
						}
					},
					error: function(xhr, type, errorThrown) {
						plus.nativeUI.toast(mylang['error_network']);
					}
				});
			}
			//return callback('会员卡录入');

		} else {
			//账户密码登陆方式
			if (loginInfo.account.length == 0) return callback('账户不能为空');
			if (!checkEmail(loginInfo.account)) return callback('账户邮件格式有误');
			if (loginInfo.password.length < 6) return callback('密码最短不能小于 6 个字符');

			mui.ajax({
				type: 'POST',
				dataType: 'json',
				url: _posturl,
				async: false,
				data: {
					m_account: loginInfo.account,
					m_password: loginInfo.password,
				},
				success: function(json) {
					var msg = eval(json);
					if (msg.code <= 0) {
						return callback(msg.info);
					} else {
						//成功返回 保存
						//alert(msg.cardnumber);
						loginInfo.account = msg.username;
						loginInfo.userid = msg.userid;
						loginInfo.auth = msg.auth;
						loginInfo.cardnumber = msg.cardnumber;
						owner.setCommon('loginInfo', loginInfo);
						return callback(0); //登陆成功
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.toast(mylang['error_network']);
				}
			});

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
	 * 用户重置修改密码
	 **/

	owner.send_password = function(re_passwdInfo, callback) {
		callback = callback || $.noop;
		re_passwdInfo = re_passwdInfo || {};
		re_passwdInfo.getemail = re_passwdInfo.getemail || '';
		re_passwdInfo.new_passwd = re_passwdInfo.new_passwd || '';
		re_passwdInfo.new_passwd2 = re_passwdInfo.new_passwd2 || '';
		re_passwdInfo.auth = re_passwdInfo.auth || '';
		if (!checkEmail(re_passwdInfo.getemail)) return callback('请填写合法邮件地址');
		if (re_passwdInfo.new_passwd.length < 6) return callback('密码最短不能小于 6 个字符');
		if (re_passwdInfo.new_passwd2.length < 6) return callback('重复密码最短不能小于 6 个字符');
		if (re_passwdInfo.new_passwd != re_passwdInfo.new_passwd2) return callback('两次密码输入不相同');
		if (re_passwdInfo.auth.length < 6) return callback('请输入6位验证码');
		//注册邮件开始
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=ajax_repasswd",
			data: {
				getemail: re_passwdInfo.getemail,
				new_passwd: re_passwdInfo.new_passwd,
				auth: re_passwdInfo.auth,
			},
			success: function(json) {
				var msg = eval(json);
				if (msg.code <= 0) {
					return callback(msg.info);
				} else {
					mui.alert(msg.info);
					return callback(0);
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast(mylang['error_network']);
			}
		});


	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(reg_email, callback) {
		callback = callback || $.noop;
		reg_email = reg_email || {};
		if (!reg_email.length) return callback(JSON.parse('{"code":0,"info":"注册邮箱地址不能为空"}'));
		if (!checkEmail(reg_email)) {
			return callback(JSON.parse('{"code":0,"info":"注册邮箱地址不正确"}'));
		} else {
			//注册邮件开始
			mui.ajax({
				async: false,
				type: 'POST',
				dataType: 'json',
				url: baseDomain + "index.php?g=Api&m=Index&a=ajax_reg",
				data: {
					reg_email: reg_email,
				},
				success: function(json) {
					var msg = eval(json);
					if (msg.code <= 0) {
						return callback(msg);
					} else {
						//保存登陆状态
						var regInfo = {
							account: msg.username,
							userid: msg.userid,
							auth: msg.auth,
							cardnumber: msg.cardnumber,
						};
						owner.setCommon('loginInfo', regInfo);
						return callback(msg);
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.toast(mylang['error_network']);
				}
			});
		}

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
			str_sql = "",
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		var settings = owner.getSettings();
		if (settings.local_id) str_sql = "&local_id=" + settings.local_id;
		else str_sql = "";
		var state = owner.getState();
		//语种筛选条件
		if (state.language) str_sql += "&language_id=" + state.language.value;
		else str_sql += "";

		if (settings.local_name) Zepto('#local_name').html(settings.local_name);
		if (settings.news_num) Zepto('#news_nums').html(settings.news_num);
		//第一步 定义路径
		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=newslist&cid=" + cid + "&p=" + page + str_sql;
		var msg = owner.getcache(_geturl);
		if (_isusecache && msg) {
			if (msg.code == 200) {
				if (msg.newnum > 0) {
					Zepto('#news_nums').html(msg.newnum);
					Zepto('#news_nums').show();
				} else {
					Zepto('#news_nums').hide();
				}
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
						//最新新闻提示
						if (msg.newnum > 0) {
							Zepto('#news_nums').html(msg.newnum);
							Zepto('#news_nums').show();
						} else {
							Zepto('#news_nums').hide();
						}
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
		var loginInfo = owner.getCommon('loginInfo');
		var page = Zepto('#page').val(),
			cid = Zepto('#cid').val();
		Zepto('#page').val(parseInt(page) + 1);
		var _geturl = baseDomain + "index.php?g=Api&m=Index&a=favourite_list&p=" + page + "&userid=" + loginInfo.userid;
		var msg = owner.getcache(_geturl);
		if (_isusecache && msg) {
			if (msg.code == 200) {
				Zepto.each(msg.data, function(i, v) {
					var str = '<li class="mui-table-view-cell" local_id="' + v.local_id + '" local_name="' + v.localname + '"  ><a class="mui-navigate-right">' + v.localname + '</a>';
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
				success: function(json) {
					owner.setcache(_geturl, json);
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							var str = '<li class="mui-table-view-cell" local_id="' + v.local_id + '"  local_name="' + v.localname + '"   ><a class="mui-navigate-right">' + v.localname + '</a>';

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
		 *  取回改用户保存的地区 //不缓存
		 **/
	owner.get_globallocalinfo_save = function() {
			var _checked = owner.getLocal();
			var is_checked = "";
			var _userinfo = owner.getCommon('loginInfo');
			_nologin = _userinfo.userid;
			var page = Zepto('#page').val(),
				cid = Zepto('#cid').val(),
				keyword = Zepto('#seach_local').val();
			Zepto('#page').val(parseInt(page) + 1);
			mui.ajax({
				timeout: 5000,
				type: 'GET',
				dataType: 'json',
				url: baseDomain + "index.php?g=Api&m=Index&a=favourite_list",
				data: {
					cid: cid,
					p: page,
					userid: _nologin
				},
				success: function(json) {
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							if (_checked.indexOf(v.local_id + ",") >= 0) is_checked = 'checked';
							else is_checked = '';
							var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.local_id + '" ><div local_id="' + v.local_id + '" local_name="' + v.localname + '">' + v.localname + ' </div><input type="checkbox" name="local_list"   title="' + v.localname + '" value="' + v.local_id + '" ' + is_checked + '></li>';
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
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);


				}
			});
			plus.nativeUI.closeWaiting();
		}
		/**
		 *  检索地区 //不缓存
		 **/
	owner.search_globallocalinfo = function(keyword) {
			var _checked = owner.getLocal();
			var is_checked = "";
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
					var msg = eval(json);
					if (msg.code == 200) {
						Zepto.each(msg.data, function(i, v) {
							if (_checked.indexOf(v.typeid + ",") >= 0) is_checked = 'checked';
							else is_checked = '';
							var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.typeid + '" >' + v.name + ' <input name="local_list"  type="checkbox" value="' + v.typeid + '" ' + is_checked + '></li>';
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
		 *  取回地区信息名称 //不缓存
		 **/
	owner.get_globallocalinfo = function() {
		var _checked = owner.getLocal();
		var is_checked = "";
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
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						if (_checked.indexOf(v.typeid + ",") >= 0) is_checked = 'checked';
						else is_checked = '';
						var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.typeid + '" >' + v.name + ' <input name="local_list" type="checkbox" value="' + v.typeid + '" ' + is_checked + '></li>';
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
	 * 找回密码 通过邮件
	 **/
	owner.get_password = function(_email, callback) {
			callback = callback || $.noop;
			if (!_email) return callback('邮箱不能为空');
			if (!checkEmail(_email)) {
				return callback('您输入的邮箱格式不正确');
			} else {
				//找回密码
				mui.ajax({
					type: 'GET',
					dataType: 'json',
					url: baseDomain + "index.php?g=Api&m=Index&a=get_password",
					data: {
						email: _email
					},
					success: function(json) {
						var msg = eval(json);
						if (msg.code <= 0) {
							return callback(msg.info);
						} else {
							plus.nativeUI.toast('验证码已经成功发送至' + _email);
						}
					},
					error: function(xhr, type, errorThrown) {
						plus.nativeUI.toast(mylang['error_network']);
					}
				});

				return callback(0);
			}
			return callback(str);
		}
		/**
		 * 返回点中的内容
		 **/
	owner.retrun_checkboxed = function(obj, callback) {
		var settings = owner.getSettings();
		var str = "",
			title = "";
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				str += obj[i].value + ',';
				title = obj[i].title;
			} //如果选中，将value添加到变量s中
		}
		var local_id = str.substring(0, str.length - 1); //返回点中的值
		settings.local_id = local_id;
		if (local_id.indexOf(',') > -1) {
			settings.local_name = '国家';
		} else {
			settings.local_name = title;
		}
		owner.setSettings(settings);
		return callback(str);
	}


	/*用户登陆*/
	owner.toMain = function(current_view) {
		//IndexLogin = plus.webview.getWebviewById("IndexLogin");
		setTimeout(function() { //延时跳转 克服闪烁
			$.openWindow({
				id: 'HBuilder',
				url: 'main.html',
				show: {
					aniShow: 'none',
					autoShow: false,
				},
				waiting: {
					autoShow: showloading
				}
			});
			current_view.close();
		}, 1500);

		current_view.close();
	}
	/*用户登陆*/
	owner.toMain_login = function(current_view) {
		IndexLogin = plus.webview.getWebviewById("IndexLogin");
			$.openWindow({
				id: 'HBuilder',
				url: 'main.html',
				show: {
					aniShow: 'none',
					autoShow: false,
				},
				waiting: {
					autoShow: showloading
				}
			});
			IndexLogin.close();
			current_view.close();
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
		/**
		 * 获取当前状态
		 * 	owner.getCommon('getState') //通用写法
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


	/*记录当前语种信息*/
	owner.setLanguage = function(language, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		state.language = language;
		owner.setState(state);
		return callback();
	};
	/**
	 * 获取默认选择的国家
	 **/
	owner.getLocal = function() {
		var localText = localStorage.getItem('$local') || "\"2,\""; //2为默认中国
		return localText;
	};
	/**
	 * 设置选择的国家
	 **/
	owner.setLocal = function(state) {
		state = state || {};
		localStorage.setItem('$local', JSON.stringify(state));
	};


	/**
	 * * 获取当前状态 通用模式
	 * @common  寄存器名称 
	 * @default_value 默认值
	 * return json
	 **/
	owner.getCommon = function(common, default_value) {
		default_value = default_value || '{}';
		var stateText = localStorage.getItem('$' + common) || default_value;
		return JSON.parse(stateText);
	};
	/**
	 * * 设置当前状态 通用模式
	 * * var common 缓存变量命名
	 * * var state  内容设置 @json
	 * * retrun null
	 **/
	owner.setCommon = function(common, state) {
		state = state || {};
		localStorage.setItem('$' + common, JSON.stringify(state));
	};

	owner.dofavorite = function(v) {
		var loginInfo = owner.getCommon('loginInfo');
		//添加到我的收藏中
		var btnArray = ['添加关注', '取消关注'];
		mui.confirm('是否添加到我的收藏地区中？', '信息提示', btnArray, function(e) {
			if (e.index == 0) {
				mui.ajax({
					type: 'GET',
					dataType: 'json',
					url: baseDomain + "index.php?g=Api&m=Index&a=dofavorite",
					data: {
						action: 'add', //yon
						auth: loginInfo.auth, //yon
						local_id: v
					},
					success: function(json) {
						var msg = eval(json);
						if (msg.code == 200) {
							plus.nativeUI.toast(msg.info);
						} else {
							plus.nativeUI.toast(msg.info);
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast(mylang['error_network']);
					}
				});
			} else {
				//取消关注
				mui.ajax({
					type: 'GET',
					dataType: 'json',
					url: baseDomain + "index.php?g=Api&m=Index&a=dofavorite",
					data: {
						action: 'del',
						auth: loginInfo.auth, //yon
						local_id: v
					},
					success: function(json) {
						var msg = eval(json);
						if (msg.code == 200) {
							plus.nativeUI.toast(msg.info);
						} else {
							plus.nativeUI.toast(msg.info);
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast(mylang['error_network']);
					}
				});

			}
		})
	};

	owner.search_list = function(keyword) {
		var _checked = owner.getLocal();
		var is_checked = "";
		var _userinfo = plus.storage.getItem("$user") || "{}";
		_userinfo = JSON.parse(_userinfo);
		_nologin = _userinfo.userid;
		var page = Zepto('#page').val();
		Zepto('#page').val(parseInt(page) + 1);
		mui.ajax({
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=global_list",
			data: {
				p: page,
				keyword: keyword
			},
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto('#newslist').html(''); //清楚历史搜索记录
					Zepto.each(msg.data, function(i, v) {
						if (_checked.indexOf(v.typeid + ",") >= 0) is_checked = 'checked';
						else is_checked = '';
						var str = '<li class="mui-table-view-cell mui-checkbox mui-right" open-sid="' + v.typeid + '" >' + v.name + ' <input name="local_list" type="checkbox"  onclick="app.dofavorite(' + v.typeid + ')" value="' + v.typeid + '" ' + is_checked + ' ></li>';
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
	};
	/*
	 * 比对是否有改国家信息资料
	 */
	owner.comp_country = function(country_name) {
		var settings = app.getSettings();
		mui.ajax({
			async: true,
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=global_list",
			data: {
				keyword: country_name
			},
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					Zepto.each(msg.data, function(i, v) {
						//追加跳转
						settings.local_id = v.typeid; //设置一个地区属性
						settings.local_name = v.name; //默认中国 2

					});
					app.setLocal(settings.local_id + ","); //选中信息筛选状态
					app.setSettings(settings);

					mui.fire(plus.webview.getWebviewById('HBuilder'), "refresh_index", {
						local_name: settings.local_id,
						local_id: settings.local_name,
					});
					return true;
				} else {
					return false;
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast(mylang['error_network']);
				return false;
			}
		});
		return true;
	}

	owner.geoInf = function(position) {
		var codns = position.coords; //获取地理坐标信息；
		var lat = codns.latitude; //获取到当前位置的纬度；
		var longt = codns.longitude; //获取到当前位置的经度
		mui.ajax({
			async: true,
			type: 'GET',
			dataType: 'json',
			url: baseDomain + "index.php?g=Api&m=Index&a=get_local",
			data: {
				'lat': lat,
				'lng': longt
			},
			success: function(json) {
				var msg = eval(json);
				if (msg.code == 200) {
					var bts = ["否", "是"];
					plus.nativeUI.confirm("检测到您当前在" + msg.info + ",您要将此作为您的首选国家吗?", function(e) {
						var i = e.index;
						if (i > 0) { //点了是 
							//比较是否有信息
							if (owner.comp_country(msg.info)) {
								owner.toMain(plus.webview.getWebviewById('search_local.html')); //关闭本事 并跳转至首页

							} else {
								alert('未找到匹配信息');
							}

							//
						} else {
							plus.nativeUI.closeWaiting();
						}
					}, "信息提示", bts);
				} else {
					plus.nativeUI.toast(mylang['error_network']);
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast(mylang['error_network']);
			}
		});
		plus.nativeUI.closeWaiting();
	};
}(mui, window.app = {}));