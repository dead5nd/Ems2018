/** 
* @fileOverview Ems102画面表示・ビジネスロジック
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
	Ems102ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems102ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
	};	
	
	
	/**
	 *
     * Search処理
	 *
     */
	Ems102ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems102prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
	
		$.ajax({
			url:stngcode.ajax.jnoUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//受信データの格納
						Ems102ViewModel.checkSrchResult(data.srch_list);
						
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Ems102ViewModel.data} , "table_Tmpl");
						// Data Tables初期化
						$('#page01Table').DataTable({
							lengthChange: false,
							searching: false,
							sort: false,
							fixedHeader: true,
							scrollY: 530,
							order:[[1,'asc']],
							displayLength: 3000, 
							columnDefs: [ {
						      targets: [0],
						      orderable: false
		   					 } ],
							language: {
								url: stngcode.dataTableJpnUrl
							} 
						});
						
						// 操作イベント設定
						Ems102ViewModel.setEvent();
						
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
     * 受信データの編集を行う
	 *
     */
	Ems102ViewModel.checkSrchResult = function(list)
	{
		Ems102ViewModel.data = [];
		for (var i = 0; i < list.length; i++) {
			Ems102ViewModel.data[i] = {};
			Ems102ViewModel.data[i]['seiri_no'] = list[i]['seiri_no'];
			Ems102ViewModel.data[i]['seiri_seq'] = list[i]['seiri_seq'];
			Ems102ViewModel.data[i]['simei'] = list[i]['simei'];
			Ems102ViewModel.data[i]['kana_simei'] = list[i]['kana_simei'];
			Ems102ViewModel.data[i]['siken_nm'] = list[i]['siken_nm'];
			
			//管理用
			Ems102ViewModel.data[i]['seq'] = i;
			
		}
	};
	/**
	 *
     * 全選択、全解除ボタンのイベント
	 *
     */
	Ems102ViewModel.setEvent = function()
	{
		$("#checkAll").on('click', function() 
		{
			$('input[name="target"]').prop('checked', true);
		});
		
		$("#clearAll").on('click', function() 
		{
			$('input[name="target"]').prop('checked', false);
		});
	};	
	
	/**
	 *
     * 送信前の確認メッセージ組み立て
	 *
     */
	Ems102ViewModel.setConfMessage = function()
	{
		var checkList = [];
		Ems102ViewModel.sendObj = [];
		var cnt = 0;
		var nendo = cmncode.getNendo();
		var seq;
		
		//選択ONの受験生の整理番号を取得する
		checkList = $('[name="target"]:checked').map(function(){
			return $(this).val();
		}).get();
		
		for(var i = 0; i < Ems102ViewModel.data.length; i++){
			seq = '#c' + i;
			if ( $(seq).prop('checked') ) {
				Ems102ViewModel.sendObj[cnt] = {};
				Ems102ViewModel.sendObj[cnt]['nendo'] = nendo;
				Ems102ViewModel.sendObj[cnt]['seiri_no'] = Ems102ViewModel.data[i]['seiri_no'];
				Ems102ViewModel.sendObj[cnt]['seiri_seq'] = Ems102ViewModel.data[i]['seiri_seq'];
				cnt++;
			}
		}
			var result = stngcode.msg.ems102conf.replace( '{0}', cnt);
		return result
	};		
	/**
	 *
     * Submit処理
	 *
     */
	Ems102ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems102prog2);
		
		// 送信情報を取得
		var list = {};
		
		var sendData = {};	
		sendData['seiri_list'] = JSON.stringify(Ems102ViewModel.sendObj);
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
		
		//医学部センター後期は2次試験地コードを利用する
		if ((Login.gakubuCd == '1') && ($("#siken_cd").val() == '5')) {
			sendData['sikenti_12ji'] = '2';
		} else {
			sendData['sikenti_12ji'] = '1';
		}
		
		$.ajax({
			url:stngcode.ajax.jnoGoUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					Ems102ViewModel.result_list = data.result_list;
					cmncode.dlg.confMessageCB2( '確認', '閉じる', '対象者リスト出力', stngcode.msg.ems102end, 
					function() { 
						Ems102ViewModel.export();
				    	return false;
					},
					function() { 
						location.reload();
				    	return false;
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
     * CSV出力処理
	 *
     */
	Ems102ViewModel.export = function()
	{
		var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var content = '整理番号,連番,受験番号,氏名\n';
		for (var i = 0; i < Ems102ViewModel.result_list.length; i++) {
			content += '"' + Ems102ViewModel.result_list[i]['seiri_no'] + '","' + Ems102ViewModel.result_list[i]['seiri_seq'];
			content += '","' + cmncode.jnoToShort(Ems102ViewModel.result_list[i]['juken_no']) + '","' + Ems102ViewModel.result_list[i]['simei'] + '"\n';
		}
		var blob = new Blob([ bom, content ], { "type" : "text/csv" });
		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "jno_export.csv"); 
		} else {
			document.getElementById("confModalOKCB2").href = window.URL.createObjectURL(blob);
		}
		location.reload();
		
	};
	
})();
