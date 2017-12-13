/** 
* @fileOverview Ems503画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/6 ログへの送信メッセージ追加に伴い、検索条件および一覧への追加
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems503ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems503ViewModel.init = function()
	{
		// Data Picker初期化
		cmncode.datepickerInit(true);
		
		//送信アカウント選択肢
		Ems503ViewModel.mailTemplate();

	};	
	
	/**
	 *
     * 送信アカウント選択肢を表示
	 *
     */
	Ems503ViewModel.mailTemplate = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems502prog2);
		
		var sendData = {};
		
		//テンプレート情報の取得
		$.ajax({
			url: stngcode.ajax.mailTmpUrl[Login.gakubuCd]['url'],
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					Ems503ViewModel.mailTmp = data;
					cmncode.template.bind("acc_Script", {"rows": Ems503ViewModel.mailTmp.acc_list} , "acc_Tmpl");
					Ems503ViewModel.appUrl = Ems503ViewModel.mailTmp.acc_list[0]['log_url']; //初期値
					//アカウント選択時の処理
					$("#acc_template").on('change', function () {
						var i = Number( $("#acc_template").val() ) -1 ;
						Ems503ViewModel.appUrl = Ems503ViewModel.mailTmp.acc_list[i]['log_url'];
						
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
     * Search処理
	 *
     */
	Ems503ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems503prog);
		
		// 送信情報を取得
		var sendData = {};	
		
		var seiri_no11 = $("#seiri_no").val();
		sendData['seiri_no'] = seiri_no11.substr(0,9);
		if (seiri_no11.length > 9) {
			sendData['seiri_seq'] = seiri_no11.substr(9);
		} else {
			sendData['seiri_seq'] = '';
		}
		sendData['juken_no'] = $("#juken_no").val();
		sendData['tmp_nm'] = $("#tmp_nm").val();
		sendData['title'] = $("#title").val();
		sendData['sdate'] = $("#sdate").val();
		sendData['edate'] = $("#edate").val();
		
		//<<2017/5/6 
		if ($("#msg").prop('checked')) {
			sendData['msg'] = '1';
		} else {
			sendData['msg'] = '0';
		}
		//>>
	
		$.ajax({
			//url: stngcode.ajax.mailHisUrl[Login.gakubuCd]['url'],
			url: Ems503ViewModel.appUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						Ems503ViewModel.checkSrchResult(data.srch_list);
						//jqueryTemplateで画面を作る
						//<<2017/5/6 
						if ($("#msg").prop('checked')) {
							cmncode.template.bind("table_Script2", {"rows": Ems503ViewModel.result_list} , "table_Tmpl");
							// Data Tables初期化 横スクロール可能とする
							$('#page01Table').DataTable({
								lengthChange: false,
								searching: false,
								sort: true,
								fixedHeader: true,
								order:[[0,'asc']],
								scrollX: true,
								scrollY: 530,
								scrollCollapse: true,
								paging: false,
								displayLength: 50,
								language: {
									url: stngcode.dataTableJpnUrl
								} 
							});
						} else {
							cmncode.template.bind("table_Script", {"rows": Ems503ViewModel.result_list} , "table_Tmpl");
							// Data Tables初期化
							cmncode.dataTablesInit(true,0);
						}
						//>>
						
						
						// 検索画面閉じる
						$("#searchAccCollapse").collapse('hide');
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
     * 検索結果一覧の中で受験番号の桁数を学部仕様にする
	 *
     */
	Ems503ViewModel.checkSrchResult = function(list)
	{
		var after_list = [];
		for (var i = 0; i < list.length; i++) {
			after_list[i] = {};
			after_list[i]['sosin_bi'] = Ems503ViewModel.isoToLocal(list[i]['sosin_bi']);
			after_list[i]['status'] = list[i]['status'];
			after_list[i]['seiri_no'] = list[i]['seiri_no'];
			after_list[i]['juken_no'] = list[i]['juken_no'];
			after_list[i]['simei'] = list[i]['simei'];
			after_list[i]['title'] = list[i]['title'];
			after_list[i]['tmp_nm'] = list[i]['tmp_nm'];
			//<<2017/5/6
			after_list[i]['msg'] = list[i]['msg'];
			//>>

		}
		
		Ems503ViewModel.result_list = after_list;
	};
	/*
	 *ISO8601の日付を変換
	 *
	 */
	Ems503ViewModel.isoToLocal = function(iso8601)
	{
		var dt = new Date(iso8601);	
		
		return dt.toLocaleString();
	};


})();
