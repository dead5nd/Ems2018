/** 
* @fileOverview Ems108Kojin画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems108KojinViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems108KojinViewModel.init = function()
	{
		//
		// URLから情報を取得する
		//
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
			if ('email' in paramArray) {
				// 認証に必要な情報をセッションストレージに保存する
				/*
				var obj = {};
				obj['email'] = paramArray['email'];
				obj['token'] = stngcode.inet.Token;
				obj['kanri'] = 'ON';
				var json_str = JSON.stringify( obj );
				sessionStorage.setItem( 'mypage', json_str);
				*/
				
				//マイページ呼び出し
				window.location.href = stngcode.inet.inetMyPageUrl + '?email=' + paramArray['email'];
			}
			
		}

	};	
	
		
})();
