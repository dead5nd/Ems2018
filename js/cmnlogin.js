/** 
 * @fileOverview ログイン認証関連処理を行う
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Login = function()
	{
	};
	
	/**
	 *
     * ログイン状態のチェックとログイン情報の取得
     */
	Login.check = function()
	{
		// URLから情報を取得する
		var url = location.search;
		var page = location.pathname;
		var param  = url.split('?');
		if (param.length > 1) {
			params = param[1].split('&');
			
			var paramArray = [];
			for ( i = 0; i < params.length; i++ ) {
				neet = params[i].split("=");
				paramArray.push(neet[0]);
				paramArray[neet[0]] = neet[1];
			}
			if ('login' in paramArray) {
				// 新しいタブで開く場合の処理
				// ログイン情報を引き継ぎする
				sessionStorage.setItem('login', paramArray['login']); 
			}
		}
		
		var json = sessionStorage.getItem('login');
		if ( (json == null) || (json == '') ) {
			sessionStorage.setItem('nextpage', page)

			// ログイン画面に遷移する
			window.location.href = stngcode.loginUrl;
		} else {
			var login = JSON.parse(json);
			Login.id = login['id'];
			Login.userName = login['user_nm'];
			Login.gakubuCd = login['gakubu_cd'];
			Login.kinoList = [];
			Login.kinoList = login['kino_list'];
			// メニュー表示
			Login.setMenu();
		}
	};	
	
	/**
	 *
     * ログイン認証を行う
	 * @param id   ユーザID
	 * @param pwd  パスワード
	 *
     */
	Login.auth = function(id, pwd)
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading('ログイン認証中');
		
		// 送信データ作成
		var sendData = {};	
		sendData['user_id'] = id;
		sendData['passwd'] = pwd;
	
		$.ajax({
			url:stngcode.ajax.loginUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					// ユーザIDを保存のために追加する
					data['id'] = id;
					sessionStorage.setItem('login', JSON.stringify(data));
					// 指定された画面に遷移する
					window.location.href = sessionStorage.getItem('nextpage');
				} else {
					cmncode.dlg.alertMessage('エラー', data.err_msg);
				}
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);

			},
			complete: function() {
				cmncode.dlg.hideLoading();
			}
		});	

	};	

	/**
	 *
     * ログアウト処理を行う
	 *
     */
	Login.logout = function()
	{
		sessionStorage.setItem('login', '');
		Login.check();

	};	
	
	/**
	 *
     * 権限情報をもとにメニューを設定する
	 *
     */
	Login.setMenu = function()
	{
		// MENU0
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU0'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU0'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU0'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU0'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu0_Script", {"rows": list} , "menu0_Tmpl");
		
		// MENU1
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU1'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU1'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU1'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU1'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu1_Script", {"rows": list} , "menu1_Tmpl");
		
		// MENU2
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU2'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU2'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU2'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU2'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu2_Script", {"rows": list} , "menu2_Tmpl");
		
		// MENU3
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU3'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU3'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU3'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU3'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu3_Script", {"rows": list} , "menu3_Tmpl");
		
		// MENU4
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU4'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU4'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU4'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU4'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu4_Script", {"rows": list} , "menu4_Tmpl");
		
		// MENU5
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU5'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU5'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU5'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU5'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu5_Script", {"rows": list} , "menu5_Tmpl");
		
		// MENU6
		var list = [];
		var idx = 0;
		for (var i = 0; i < menu.itemList['MENU6'].length; i++) {
			for (var j = 0; j < Login.kinoList.length; j++) {
				if (Login.kinoList[j]['kino_id'] == menu.itemList['MENU6'][i]['cd']) {
					list[idx] = {};
					list[idx]['url'] = menu.itemList['MENU6'][i]['url'];
					list[idx]['name'] = menu.itemList['MENU6'][i]['name'];
					idx++;
				}
			}
		}
		cmncode.template.bind("menu6_Script", {"rows": list} , "menu6_Tmpl");

		
		// 担当者名設定
		$("#loginUserName").text(Login.userName+'　');
		
		// ログアウトボタンのイベント設定
		$(document).on('click', "#menu_Logout", function() 
		{
			Login.logout();
		});
		
		// タイトル設定
		$("#menuTitle").text(menu.title);
		
	};	
		
})();

