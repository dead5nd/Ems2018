/** 
* @fileOverview Ems304画面表示・ビジネスロジック
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
	Ems304ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems304ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		//連動選択項目の処理
		Ems304ViewModel.jiSelect();
	};
	/**
	 *
     * 1次2次選択の表示、非表示
	 *
     */
	Ems304ViewModel.jiSelect = function()
	{
	var siken_cd = $("#siken_cd").val();
	if ( cmncode.check2ji(siken_cd) ) {
			$("#12jiselect").show();
		} else {
			$("#12jiselect").hide();
		}
	};		
	
	
	/**
	 *
     * 処理開始
	 *
     */
	Ems304ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems304prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['12ji_kubun'] = $("#12ji_kubun").val();
		sendData['asikiri'] = '1'; //足切は除外する
		
		$.ajax({
			url:stngcode.ajax.totalScoreUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//総合点の算出
						Slist.init(data.srch_list);
						Slist.totalScore();
						
						//総合点の登録
						cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
							Slist.setConfMessage() ,  
							function() { 
								Ems304ViewModel.submit();
					    		return false;
							});	
						
					} else {
						cmncode.dlg.alertMessage('確認', stngcode.msg.notFound);
					}

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
     * Submit処理
	 *
     */
	Ems304ViewModel.submit = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems304prog2);
		
		// 送信情報を取得
		var list = {};
		
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['jno_list'] = Slist.sendData(); //送信対象をJSON形式で設定
	
		$.ajax({
			url:stngcode.ajax.totalScoreRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems304end, function() {
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
