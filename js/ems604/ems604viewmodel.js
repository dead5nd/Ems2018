/** 
* @fileOverview Ems604画面表示・ビジネスロジック
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
	Ems604ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems604ViewModel.init = function()
	{

	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems604ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems604prog);
		
		// 送信情報を取得
		var fd = new FormData(form);
	
		$.ajax({
			url:stngcode.ajax.mstImpUrl,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems604end, function() {
						location.reload();
					});

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
