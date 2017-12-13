/** 
* @fileOverview Ems401画面表示・ビジネスロジック
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
	Ems401ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems401ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		//連動選択項目の処理
		Ems401ViewModel.jiSelect();
		Ems401ViewModel.wakuSelect();
		
	};	
	/**
	 *
     * 1次2次選択の表示、非表示
	 *
     */
	Ems401ViewModel.jiSelect = function()
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
     * 地域枠、一般枠選択の表示、非表示
	 *
     */
	Ems401ViewModel.wakuSelect = function()
	{
	var siken_cd = $("#siken_cd").val();
	if ( cmncode.checkWaku(siken_cd) ) {
			$("#wakuselect").show();
		} else {
			$("#wakuselect").hide();
		}
	};	
	/**
	 *
     * 検索の事務処理フェーズ確認
     */
	Ems401ViewModel.search = function()
	{
		var siken_cd = $("#siken_cd").val();	
		var gakka_cd = $("#gakka_cd").val();
		StepChk.show(siken_cd, gakka_cd, function () {
			Ems401ViewModel.stepCheck();	
		});
	};
	/**
	 *
     * 事務処理フェーズチェック
     */
	Ems401ViewModel.stepCheck = function()
	{
		switch (StepChk.ret['cd']) {
			case '2': //受験番号確定
				Ems401ViewModel.goSearch();
				break;
			
			case '5': //一次合否確定
				if ($("#12ji_kubun").val() == '1') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error4, function() {
						location.reload();
					});
				} else {
					Ems401ViewModel.goSearch();
				}
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
	Ems401ViewModel.goSearch = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems401prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo;
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['12ji_kubun'] = $("#12ji_kubun").val();
		
		
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}

		$.ajax({
			url:stngcode.ajax.passEntryUrl,
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
							if (Slist.entryType == '1') {
								cmncode.template.bind("table_Script1",  Slist.data , "table_Tmpl");
							} else {
								cmncode.template.bind("table_Script2",  Slist.data , "table_Tmpl");
							}
							// Data Tables初期化
							
							$('#page01Table').DataTable({
								lengthChange: false,
								searching: false,
								sort: false,
								fixedHeader: true,
								scrollY: 520,
								displayLength: 3000,
								language: {
									url: stngcode.dataTableJpnUrl
								} 
							});
							
							//一覧表示の初期処理
							if ( Slist.initList() ) {
								cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error1, function() {
									location.reload();
								});
								
							} else {
								//合否選択のイベント
								Slist.setChangeEvent('on');
								
								// 検索画面閉じる
								$("#searchAccCollapse").collapse('hide');
								
							}
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
     * 合否登録
	 *
     */
	Ems401ViewModel.submit = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems401prog2);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['jno_list'] = Slist.sendData(); //送信対象をJSON形式で設定
		
		//<<2017/6/13
		//地域枠ありの場合、地域枠用の合否判定区分を更新する
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}
		
		
		$.ajax({
			url: stngcode.ajax.passEntryRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401end, function() {
						//location.reload();
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
	
	/**
	 *
     * 合否結果集計
	 *
     */
	Ems401ViewModel.gohiSummary = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems401prog1);
		
		// 送信情報を取得
		var sendData = {};	
		
		sendData['nendo'] = cmncode.getNendo;
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}
		
		$.ajax({
			url: stngcode.ajax.passSummaryUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					//集計結果をポップアップ表示する
					Ems401ViewModel.openDialog(data);
					
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
     * 合否結果集計用ダイアログ表示
	 * @param data 受信データオブジェクト
	 *
     */	
	Ems401ViewModel.openDialog = function(data)
	{		
		
		//テンプレート選択肢の設定
		cmncode.template.bind("modal_Script", data , "modal_Tmpl");
			
		$("#gohiSummary").modal();
		
	
	};

})();
