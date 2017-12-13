/** 
* @fileOverview Ems101画面表示・ビジネスロジック
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
	Ems101BcrViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems101BcrViewModel.init = function()
	{
		//売上日は本日をセット
		$("#ok_bi").val( cmncode.getToday() );
		// Data Picker初期化
		cmncode.datepickerInit(true);
		
		//登録済み情報表示用リスト
		Ems101BcrViewModel.List = [];
		
		//フォーカス設定
		$("#bcr").focus();
	};	

	
	/**
	 *
     * 受付情報を登録
	 *
     */
	Ems101BcrViewModel.regist = function(scan)
	{
		//バーコードの情報チェック
		var scan_datas = scan.split('-');
		if ((scan.length != 15) || (scan_datas.length != 4)) {
			//バーコード情報エラー
			
		} else {
			// 送信中のメッセージ表示
			cmncode.dlg.showLoading(stngcode.msg.ems101prog2);
			
			// 送信情報を取得
			
			var sendData = {};
			
			var nendo = cmncode.getNendo();
			var seiri_no = scan_datas[0];
			var seiri_seq = scan_datas[2] + scan_datas[3];
			var uketuke_stat = $("#uketuke_stat").val();
			var check_bi = cmncode.getToday();
			var ok_bi = uketuke_stat == cd.uketukeOK ? $("#ok_bi").val() : '';
			var block_no = $("#block_no").val();
			var biko = $("#biko").val();

			var sql = " EXECUTE [db_owner].[BcrUpdateUketuke] N'nendo', N'seiri_no', N'seiri_seq', N'uketuke_stat', N'check_bi', N'ok_bi', N'block_no', N'biko' ";

			sql = sql.replace('nendo', nendo);
			sql = sql.replace('seiri_no', seiri_no);
			sql = sql.replace('seiri_seq', seiri_seq);
			sql = sql.replace('uketuke_stat', uketuke_stat);
			sql = sql.replace('check_bi', check_bi);
			sql = sql.replace('ok_bi', ok_bi);
			sql = sql.replace('block_no', block_no);
			sql = sql.replace('biko', biko);
			
			sendData['sql'] = sql;
		
			$.ajax({
				url:stngcode.ajax.cmnSrchUrl,
				type: 'post',
				//contentType: false,
				timeout: stngcode.ajax.timeOut,
				data: sendData,
				dataType: 'json',
				success: function (data) {
					// サーバからのデータを解析して表示する
					if (data.stat == 'OK') {
						if ('srch_list' in data) {
							//受信データの編集処理
							Ems101BcrViewModel.addList(data.srch_list);
							//jqueryTemplateで画面を作る
							cmncode.template.bind("table_Script", {"rows":Ems101BcrViewModel.List} , "table_Tmpl");
														
							//次の入力準備
							$("#bcr").focus();
								
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
		}
	};
	/**
	 *
     * 結果表示用リスト情報の編集
	 * @parameter 結果リスト
     */
	Ems101BcrViewModel.addList = function(list)
	{
		var obj = {};
		obj['syutugan_bi'] = cmncode.mdy2ymd( list[0]['c1'] );
		obj['check_bi'] = cmncode.mdy2ymd( list[0]['c2'] );
		obj['seiri_no'] = list[0]['c3'];
		obj['simei'] = list[0]['c4'] + ' ' + list[0]['c5'];
		obj['uketuke'] = list[0]['c6']==cd.uketukeOK ? 'ＯＫ' : '不備';
		obj['ok_bi'] = cmncode.mdy2ymd( list[0]['c7'] );
		obj['block_no'] = list[0]['c8'];
		obj['biko'] = list[0]['c9'];
		
		Ems101BcrViewModel.List.push(obj);

	};

})();
