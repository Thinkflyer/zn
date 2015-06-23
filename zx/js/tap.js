//关于链接的处理
mui('.mui-content').on('tap', 'a', function() {
	var id = this.getAttribute('href');
	var title = this.getAttribute('open-title');
	var uid = this.getAttribute('open-uid');
	var type = this.getAttribute('open-type');
	if (type == "common") {
		mui.openWindow({
			id: id,
			url: this.href,
			waiting: {
				autoShow: false
			},
			extras: {
				uid: uid,
				title: title
			},
			show: {
				aniShow: "slide-in-right",
				duration: 300
			},
			styles: {
				zindex: 1,
			},
		});
	} else {
		if (id && ~id.indexOf('.html')) {
			var href = this.href;
			//获得共用模板组
			var template = ~href.indexOf('pullrefresh.html') ? getTemplate('pullrefresh') : getTemplate('default');
			//判断是否显示右上角menu图标；
			var showMenu = ~href.indexOf('left_menu.html') ? true : false;
			//获得共用父模板
			var headerWebview = template.header;
			//获得共用子webview
			var contentWebview = template.content;
			var title = this.innerText.trim();
			//通知模板修改标题，并显示隐藏右上角图标；
			mui.fire(headerWebview, 'updateHeader', {
				title: title,
				showMenu: showMenu
			});
			var reload = true;
			if (!template.loaded) {
				if (contentWebview.getURL() != this.href) {
					contentWebview.loadURL(this.href);
				} else {
					reload = false;
				}
			} else {
				reload = false;
			}
			(!reload) && contentWebview.show();
			headerWebview.show('slide-in-right', 150);
		}
	}

});

//主列表点击事件
mui('#footer_bar').on('tap', 'a', function() {
	var id = this.getAttribute('href');
	var type = this.getAttribute("open-type");
	if (type == "common") {
		if (~id.indexOf('offcanvas-')) {
			var pop = ~id.indexOf('offcanvas-with-right') ? "close" : "none";
			mui.openWindow({
				id: id,
				url: this.href,
				styles: {
					zindex: 1,
					popGesture: pop
				},
				waiting: {
					autoShow: false
				}
			});
		} else {
			mui.openWindow({
				id: id,
				url: this.href,
				waiting: {
					autoShow: false
				}
			});
		}
	} else {
		if (id && ~id.indexOf('.html')) {
			var href = this.href;
			//获得共用模板组
			var template = ~href.indexOf('pullrefresh.html') ? getTemplate('pullrefresh') : getTemplate('default');
			//判断是否显示右上角menu图标；
			var showMenu = ~href.indexOf('left_menu.html') ? true : false;
			//获得共用父模板
			var headerWebview = template.header;
			//获得共用子webview
			var contentWebview = template.content;
			var title = this.innerText.trim();
			//通知模板修改标题，并显示隐藏右上角图标；
			mui.fire(headerWebview, 'updateHeader', {
				title: title,
				showMenu: showMenu
			});
			var reload = true;
			if (!template.loaded) {
				if (contentWebview.getURL() != this.href) {
					contentWebview.loadURL(this.href);
				} else {
					reload = false;
				}
			} else {
				reload = false;
			}
			(!reload) && contentWebview.show();
			headerWebview.show('slide-in-right', 150);
		}
	}
});
