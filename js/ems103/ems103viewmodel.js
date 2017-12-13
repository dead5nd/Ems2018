/** 
* @fileOverview Ems103画面表示・ビジネスロジック
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
	Ems103ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems103ViewModel.init = function()
	{

	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems103ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems103prog);
		
		// 送信情報を取得
		$("#nendo").val(cmncode.getNendo());
		if ( $("#upd_chk").prop('checked') ) {
			$("#upd_flg").val('1');
		} else {
			$("#upd_flg").val('0');
		}
		var fd = new FormData(form);
	
		$.ajax({
			url:stngcode.ajax.webImpUrl,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', data.syori + stngcode.msg.ems103end);

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
