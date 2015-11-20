/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
	
		if (loginInfo.account.length < 11) {
			return callback('用户名输入格式错误');
		}
		if (loginInfo.password.length < 4) {
			return callback('密码最短为 4 个字符');
		}
		
		/*var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
		*/
	};

	owner.createState = function(name,token, callback) {
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
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
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
	owner.forgetPassword = function(account, auth,callback) {
		callback = callback || $.noop;
		if (!account) {
			return callback(0,'手机号码不能为空');
		}else if (account < 11) {
			return callback(0,'手机号码输入格式错误');
		}else if (!auth){
			return callback(0,'验证码不能为空');
			
		}else{
			return callback(1);
		}

		
	};


/**重置密码**/

/**
	 * 找回密码
	 **/
	owner.submitPassword = function(password_1, password_2,callback) {
		callback = callback || $.noop;
		if (!password_1 || !password_2) {
			return callback(0,'重置密码不能为空');
		}else if (password_1 < 6) {
			return callback(0,'重置密码不能小于6位');
		}else if (password_1!=password_2){
			return callback(0,'密码与确认密码不符');
		}else{
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