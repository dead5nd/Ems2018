/** 
* @fileOverviewEms602画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/6 検索条件として登録日(範囲)を追加
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems602ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems602ViewModel.init = function()
	{
		//<<2017/5/6
		// Data Picker初期化
		cmncode.datepickerInit(true);
		//>>
		
		//送信アカウント選択肢
		Ems602ViewModel.mailTemplate();
	};	
	/**
	 *
     * 送信アカウント選択肢を表示
	 *
     */
	Ems602ViewModel.mailTemplate = function()
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
					Ems602ViewModel.mailTmp = data;
					cmncode.template.bind("acc_Script", {"rows": Ems602ViewModel.mailTmp.acc_list} , "acc_Tmpl");
					Ems602ViewModel.appUrl = Ems602ViewModel.mailTmp.acc_list[0]['app_url']; //初期値
					//アカウント選択時の処理
					$("#acc_template").on('change', function () {
						var i = Number( $("#acc_template").val() ) -1 ;
						Ems602ViewModel.appUrl = Ems602ViewModel.mailTmp.acc_list[i]['app_url'];
						
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
	Ems602ViewModel.search = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems602prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['command'] = 'list';
		//<<2017/5/6
		sendData['sdate'] = $("#sdate").val();
		sendData['edate'] = $("#edate").val();
		//>>
	
		$.ajax({
			//url:stngcode.ajax.mailAppUrl[Login.gakubuCd]['url'],
			url:Ems602ViewModel.appUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					Ems602ViewModel.checkSrchResult(data.srch_list);
					//jqueryTemplateで画面を作る
					cmncode.template.bind("table_Script", {"rows": Ems602ViewModel.result_list} , "table_Tmpl");
					// Data Tables初期化
					//cmncode.dataTablesInit(true,1);
					$('#page01Table').DataTable({
							searching: false,
							sort: true,
							fixedHeader: true,
							scrollY: 150,
							order:[[1,'asc']],
							displayLength: 50, 
							columnDefs: [ {
						      targets: [0],
						      orderable: false
		   					 } ],
							language: {
								url: stngcode.dataTableJpnUrl
							} 
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
     * メール送信内容の検索
	 *
     */
	Ems602ViewModel.searchDetail = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems602prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['command'] = 'listDetail';
	
		$.ajax({
			//url:stngcode.ajax.mailAppUrl[Login.gakubuCd]['url'],
			url:Ems602ViewModel.appUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					//jqueryTemplateで画面を作る
					cmncode.template.bind("table_Script2", {"rows": data.srch_list} , "table_Tmpl2");
					// Data Tables初期化
					//cmncode.dataTablesInit(true,1);
					$('#page01Table2').DataTable({
							searching: false,
							sort: false,
							fixedHeader: true,
							scrollY: 400,
							displayLength: 50, 
							language: {
								url: stngcode.dataTableJpnUrl
							} 
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
     * 検索結果一覧の中で受験番号の桁数を学部仕様にする
	 *
     */
	Ems602ViewModel.checkSrchResult = function(list)
	{
		var after_list = [];
		for (var i = 0; i < list.length; i++) {
			after_list[i] = {};
			after_list[i]['id'] = list[i]['id'];
			after_list[i]['toroku_bi'] = Ems602ViewModel.isoToLocal(list[i]['toroku_bi']);
			after_list[i]['title'] = list[i]['title'];
			after_list[i]['count'] = list[i]['count'];
			//管理用
			after_list[i]['seq'] = i;
		}
		
		Ems602ViewModel.result_list = after_list;
	};

	/**
	 *
     * 確定処理
	 * @param 操作指示
	 *
     */
	Ems602ViewModel.submit = function(command)
	{
		
		var list = [];
		var sendData = {};
		var seq;
		var cnt = 0;
		
		
		//選択ONのデータを作成する
		for (var i = 0; i < Ems602ViewModel.result_list.length; i++) {
			seq = '#' + i;
			if ( $(seq).prop('checked') ) {
				list[cnt] = Ems602ViewModel.result_list[i]['id'];
				cnt++;
			}
		}
		
		// 選択無ならエラー
		if (cnt == 0) {
			cmncode.dlg.alertMessage('エラー', stngcode.msg.ems602error);
		} else {
			// 送信中のメッセージ表示
			cmncode.dlg.showLoading(stngcode.msg.ems602prog2);
			sendData['command'] = command;
			sendData['param'] = JSON.stringify(list);
		
			$.ajax({
				//url:stngcode.ajax.mailAppUrl[Login.gakubuCd]['url'],
				url:Ems602ViewModel.appUrl,
				type: 'GET',
				dataType: 'jsonp',
				data: sendData,
				contentType: false,
				cache : false,
				timeout: stngcode.ajax.timeOut,
				success: function(data) {
					if (data.stat == 'OK') {
						
						cmncode.dlg.alertMessageCB('確認', 	stngcode.msg.ems602end,
							function() { 
								location.reload();
					    		return false;
							});
						
					} else {
						cmncode.dlg.alertMessage('エラー', data.err_msg);
						cmncode.dlg.hideLoading();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
					cmncode.dlg.hideLoading();
				},
				complete: function() {
					cmncode.dlg.hideLoading();
				}
			});
		}
		
	};	
	/*
	 *ISO8601の日付を変換
	 *
	 */
	Ems602ViewModel.isoToLocal = function(iso8601)
	{
		var dt = new Date(iso8601);	
		
		return dt.toLocaleString();
	};

})();
