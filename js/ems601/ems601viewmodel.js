/** 
* @fileOverview Ems601画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems601ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems601ViewModel.init = function()
	{

	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems601ViewModel.submit = function()
	{
		var old_passwd = $("#old_passwd").val();
		var new_passwd = $("#new_passwd").val();
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems601prog);
		
		// 送信データ作成
		var login = JSON.parse(sessionStorage.getItem('login'));
		var sendData = {};	
		sendData['user_id'] = login['id'];
		sendData['old_passwd'] = old_passwd;
		sendData['new_passwd'] = new_passwd;
	
		$.ajax({
			url:stngcode.ajax.passChangeUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					//再度ログインするためセッション情報をクリア
					sessionStorage.setItem('login', '');
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems601conf, function() {window.location.href = stngcode.topUrl;});
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
	
})();
