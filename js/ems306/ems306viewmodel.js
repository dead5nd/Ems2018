/** 
* @fileOverview Ems306画面表示・ビジネスロジック
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
	Ems306ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems306ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
	};	
	/**
	 *
     * 検索の事務処理フェーズ確認
     */
	Ems306ViewModel.search = function()
	{
		var siken_cd = $("#siken_cd").val();	
		var gakka_cd = $("#gakka_cd").val();
		StepChk.show(siken_cd, gakka_cd, function () {
			Ems306ViewModel.stepCheck();	
		});
	};
	/**
	 *
     * 事務処理フェーズチェック
     */
	Ems306ViewModel.stepCheck = function()
	{
		switch (StepChk.ret['cd']) {
			case '2': //受験番号確定
				Ems306ViewModel.goSearch();
				break;
			
			case '5': //一次合否確定
				cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error4, function() {
					location.reload();
				});
				break;
			
			case '3': //合否確定
				cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error2, function() {
					location.reload();
				});
				break;
			
			default: //その他事務処理フェーズ
				cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error3, function() {
					location.reload();
				});
				break;
		}
	};	
	/**
	 *
     * Search実行処理
     */
	Ems306ViewModel.goSearch = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems306prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['kamoku_cd'] = '';
		sendData['sikenti_cd'] = '';
		sendData['12ji_kubun'] = '1';
		sendData['yosi_no'] = '';
		sendData['start_juken_no'] = '';
		sendData['end_juken_no'] ='';
		sendData['cnt_juken_no'] = '';
		sendData['ketu_flg'] = '0';
		sendData['1jing_flg'] = '0'; 
		sendData['asikiri_flg'] = '0';
		sendData['nendo'] = cmncode.getNendo();

		$.ajax({
			url:stngcode.ajax.kamokuSeisekiUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						if (data.srch_list.length > 0) {
							//受信データの編集処理
							Slist.init(data.srch_list);
							
							//jqueryTemplateで画面を作る
							cmncode.template.bind("table_Script", Slist.data , "table_Tmpl");
							// Data Tables初期化
							
							$('#page01Table').DataTable({
								lengthChange: false,
								searching: false,
								sort: true,
								fixedHeader: true,
								scrollY: 520,
								displayLength: 3000,
								language: {
									url: stngcode.dataTableJpnUrl
								} 
							});
							//合否欄の初期表示
							Slist.initList();
							
							// 検索画面閉じる
							$("#searchAccCollapse").collapse('hide');
								
						} else {
							cmncode.dlg.alertMessage('確認', stngcode.msg.notFound);
							// 検索条件入力有効
							$(".cs-search").prop('disabled', false);
						}
					} else {
						cmncode.dlg.alertMessage('確認', stngcode.msg.notFound);
						// 検索条件入力有効
						$(".cs-search").prop('disabled', false);
					}

				} else {
					cmncode.dlg.alertMessage('エラー', data.err_msg);
					// 検索条件入力有効
					$(".cs-search").prop('disabled', false);
				}
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
				// 検索条件入力有効
				$(".cs-search").prop('disabled', false);

			},
			complete: function() {
				cmncode.dlg.hideLoading();
			}
		});	
		
	};	


	/**
	 *
     * 足切登録
	 *
     */
	Ems306ViewModel.submit = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems306prog2);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['seiseki_list'] = Slist.sendData(); //送信対象をJSON形式で設定
		
		$.ajax({
			url: stngcode.ajax.asikiriRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems306end, function() {
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
