/** 
* @fileOverview Ems307画面表示・ビジネスロジック
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
	Ems307ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems307ViewModel.init = function()
	{
		//var code = Login.gakubuCd;
		//cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems307ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems307prog);
		
		// 送信情報を取得
		$("#nendo").val(cmncode.getNendo());
		$("#jyuken_no_top2").val(cmncode.getJnoTop2());
		//$("#gakka_cd").val('1'); //ダミーの学科コード 入力エラー回避のため
		var fd = new FormData(form);
	
		$.ajax({
			url:stngcode.ajax.gohiImpUrl,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', data.syori + stngcode.msg.ems307end,
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
