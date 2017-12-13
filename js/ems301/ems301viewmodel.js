/** 
* @fileOverview Ems301画面表示・ビジネスロジック
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
	Ems301ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems301ViewModel.init = function()
	{

	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems301ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems301prog);
		
		// 送信情報を取得
		$("#nendo").val(cmncode.getNendo());
		$("#jyuken_no_top2").val(cmncode.getJnoTop2());
		var fd = new FormData(form);
		
		//URLの振り分け
		var toroku_flg = $("#toroku_flg").val();
		if (toroku_flg == '0') {
			var url = stngcode.ajax.centerImpUrl; //センター試験用
		} else {
			var url = stngcode.ajax.scoreImpUrl; 
		}
	
		$.ajax({
			url:url,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', data.syori + stngcode.msg.ems301end,
						function() {
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
