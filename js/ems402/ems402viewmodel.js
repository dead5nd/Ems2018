/** 
* @fileOverview Ems402画面表示・ビジネスロジック
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
	Ems402ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems402ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		cmncode.template.bind("nokin_Script", {"rows": cd.nokin} , "nokin_Tmpl");
		
		//<<2017/6/14
		//連動選択項目の処理
		Ems402ViewModel.wakuSelect();
	};	
	
	
	/**
	 *
     *  検索の事務処理フェーズ確認
     */
	Ems402ViewModel.search = function()
	{
		var siken_cd = $("#siken_cd").val();	
		var gakka_cd = $("#gakka_cd").val();
		StepChk.show(siken_cd, gakka_cd, function () {
			Ems402ViewModel.stepCheck();	
		});
	};
	/**
	 *
     * 事務処理フェーズの確認
     */
	Ems402ViewModel.stepCheck = function()
	{
		switch (StepChk.ret['cd']) {
			case '2': //受験番号確定
			case '5': //一次合否確定
				Ems402ViewModel.goSearch();
				break;
			
			case '3': //合否確定
				Ems402ViewModel.goSearch();	
				//cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error2, function() {
				//	location.reload();
				//});
				break;
			
			default: //その他事務処理フェーズ
				cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems401error3, function() {
					location.reload();
				});
				break;
		}
	};
	//<<2017/6/14
	/**
	 *
     * 地域枠、一般枠選択の表示、非表示
	 *
     */
	Ems402ViewModel.wakuSelect = function()
	{
	var siken_cd = $("#siken_cd").val();
	if ( cmncode.checkWaku(siken_cd) ) {
			$("#wakuselect").show();
		} else {
			$("#wakuselect").hide();
		}
	};	
	//>>
	
	/**
	 *
     * Search実行処理
     */
	Ems402ViewModel.goSearch = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems402prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo;
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['gohi_stat'] = $("#gohi_stat").val();
		sendData['nokin_stat'] = $("#nokin_stat").val();
		sendData['1jing_flg'] = '1'; //1次不合格者は対象外
		
		//<<2017/6/14
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}
		//>>
		
		if ($("#hoketu_jun").prop('checked')) {
			Ems402ViewModel.hoketu_jun = '1';
			sendData['gohi_stat'] = '4'; //補欠で検索する
		} else {
			Ems402ViewModel.hoketu_jun = '0';
		}

		$.ajax({
			url:stngcode.ajax.carryPassUrl,
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
							cmncode.template.bind("table_Script",  Slist.data , "table_Tmpl");
							
							// Data Tables初期化
							$('#page01Table').DataTable({
								lengthChange: false,
								searching: false,
								sort: true,
								fixedHeader: true,
								scrollY: 530,
								columnDefs: [ {
							      targets: [2,5,6],
							      orderable: false
			   					 } ],
								displayLength: 3000,
								language: {
									url: stngcode.dataTableJpnUrl
								} 
							});
							
							//一覧表示の初期処理
							Slist.initList();
							
							//合否選択のイベント
							Slist.setChangeEvent();
							
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
     * 繰上合格登録
	 *
     */
	Ems402ViewModel.submit = function()
	{
	
		
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['jno_list'] = Slist.sendData(); //送信対象をJSON形式で設定
		
		//<<2017/6/14
		//地域枠ありの場合、地域枠用の合否判定区分を更新する
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}
		
		if (Slist.bikoError) {
			cmncode.dlg.alertMessage('エラー', stngcode.msg.ems402error);
		} else {
			// 送信中のメッセージ表示
			cmncode.dlg.showLoading(stngcode.msg.ems402prog2);
			
			$.ajax({
				url: stngcode.ajax.carryPassRegUrl,
				type: 'post',
				//contentType: false,
				timeout: stngcode.ajax.timeOut,
				data: sendData,
				dataType: 'json',
				success: function (data) {
					if (data.stat == 'OK') {
						cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems402end, function() {
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
		}

	};
	
	/**
	 *
     * 合否結果集計
	 *
     */
	Ems402ViewModel.nokinSummary = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems402prog1);
		
		// 送信情報を取得
		var sendData = {};	
		
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		
		//<<2017/6/14
		//地域枠ありの条件を追加
		if ($("#tiiki_ari").prop('checked')) {
			sendData['tiiki_ari'] = '1';
		} else {
			sendData['tiiki_ari'] = '0';
		}
		
		$.ajax({
			url: stngcode.ajax.nokinSummaryUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					//集計結果をポップアップ表示する
					Ems402ViewModel.openDialog(data);
					
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
	* 合否結果集計(学科計)
	 *
     */
	Ems402ViewModel.nokinSummaryAll = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems402prog1);
		
		// 送信情報を取得
		var sendData = {};	
		
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		//sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['tiiki_ari'] = '0';
		
		$.ajax({
			url: stngcode.ajax.nokinSummaryUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					//集計結果をポップアップ表示する
					Ems402ViewModel.openDialog(data);
					
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
	Ems402ViewModel.openDialog = function(data)
	{		
		//ToDo:受信データをもとに集計処理を行う
		var sum = {};
		
		sum['bosyu_su'] = Number( data['bosyu_su'] );
		sum['bc_1'] = Number( data['b1'] ) + Number( data['c1'] );
		sum['bc_8'] = Number( data['b8'] ) + Number( data['c8'] );
		sum['bc_2'] = Number( data['b2'] ) + Number( data['c2'] );
		sum['bc_23'] = Number( data['b2'] ) + Number( data['c2'] ) + Number( data['b3'] ) + Number( data['c3'] );
		sum['bc_4'] = Number( data['b4'] ) + Number( data['c4'] );
		sum['bc_45'] = Number( data['b4'] ) + Number( data['c4'] ) + Number( data['b5'] ) + Number( data['c5'] );
		sum['bc_6'] = Number( data['b6'] ) + Number( data['c6'] );
		sum['bc_67'] = Number( data['b6'] ) + Number( data['c6'] ) + Number( data['b7'] ) + Number( data['c7'] );
		sum['bc_sum'] = sum['bc_1'] + sum['bc_8'] + sum['bc_23'] + sum['bc_45'] + sum['bc_67'];
			
		sum['de_1'] = Number( data['d1'] ) + Number( data['e1'] );
		sum['de_8'] = Number( data['d8'] ) + Number( data['e8'] );
		sum['de_2'] = Number( data['d2'] ) + Number( data['e2'] );
		sum['de_23'] = Number( data['d2'] ) + Number( data['e2'] ) + Number( data['d3'] ) + Number( data['e3'] );
		sum['de_4'] = Number( data['d4'] ) + Number( data['e4'] );
		sum['de_45'] = Number( data['d4'] ) + Number( data['e4'] ) + Number( data['d5'] ) + Number( data['e5'] );
		sum['de_6'] = Number( data['d6'] ) + Number( data['e6'] );
		sum['de_67'] = Number( data['d6'] ) + Number( data['e6'] ) + Number( data['d7'] ) + Number( data['e7'] );
		sum['de_sum'] = sum['de_1'] + sum['de_8'] + sum['de_23'] + sum['de_45'] + sum['de_67'];
		
		sum['a_1'] = Number( data['a1'] );
		sum['a_8'] = Number( data['a8'] );
		sum['a_2'] = Number( data['a2'] );
		sum['a_23'] = Number( data['a2'] ) + Number( data['a3'] );
		sum['a_4'] = Number( data['a4'] );
		sum['a_45'] = Number( data['a4'] ) + Number( data['a5'] );
		sum['a_6'] = Number( data['a6'] );
		sum['a_67'] = Number( data['a6'] ) + Number( data['a7'] );
		sum['a_sum'] = sum['a_1'] + sum['a_8'] + sum['a_23'] + sum['a_45'] + sum['a_67'];
		
		sum['yotei'] = sum['bc_67'] + sum['de_67'] + sum['a_67'];
		sum['husoku'] = sum['yotei'] - sum['bosyu_su'];
		
		
		//テンプレート選択肢の設定
		cmncode.template.bind("modal_Script", sum , "modal_Tmpl");
			
		$("#nokinSummary").modal();
		
	
	};

})();
