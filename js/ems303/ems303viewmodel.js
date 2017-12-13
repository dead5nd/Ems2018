/** 
* @fileOverview Ems303画面表示・ビジネスロジック
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
	Ems303ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems303ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		//連動選択項目の処理
		Ems303ViewModel.kamokuSelect();
		Ems303ViewModel.jiSelect();
	};
	/**
	 *
     * 1次2次選択の表示、非表示
	 *
     */
	Ems303ViewModel.jiSelect = function()
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
     * 科目選択欄の更新
	 *
     */
	Ems303ViewModel.kamokuSelect = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems302prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['12ji_kubun'] = $("#12ji_kubun").val();
		
		$.ajax({
			url:stngcode.ajax.getKamokuUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						cmncode.template.bind("kamoku_Script", {"rows": data.srch_list} , "kamoku_Tmpl");
						
					} else {
						cmncode.template.bind("kamoku_Script", {"rows": []} , "kamoku_Tmpl");
						
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
     * Search処理
	 *
     */
	Ems303ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems303prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['kamoku_cd'] = $("#kamoku_cd").val();
		sendData['12ji_kubun'] = $("#12ji_kubun").val();
		//2次の場合、1次不合格者を除く
		if (sendData['12ji_kubun'] == '2') {
			sendData['1jing_flg'] = '1';
		} else {
			sendData['1jing_flg'] = '0'; 
		}
		sendData['asikiri_flg'] = '1'; //足切除外する
	
		$.ajax({
			url:stngcode.ajax.muSeisekiSrchUrl,
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
						Ems303ViewModel.checkSrchResult(data.srch_list);
						
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Ems303ViewModel.data} , "table_Tmpl");
						// Data Tables初期化
						$('#page01Table').DataTable({
							lengthChange: false,
							searching: false,
							sort: true,
							fixedHeader: true,
							scrollY: 530,
							order:[[1,'asc']],
							displayLength: 3000, 
							language: {
								url: stngcode.dataTableJpnUrl
							} 
						});
						
						// 操作イベント設定
						Ems303ViewModel.setEvent();
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
	Ems303ViewModel.checkSrchResult = function(list)
	{
		Ems303ViewModel.data = [];
		for (var i = 0; i < list.length; i++) {
			Ems303ViewModel.data[i] = {};
			Ems303ViewModel.data[i]['juken_no'] = list[i]['juken_no'];
			Ems303ViewModel.data[i]['simei'] = list[i]['simei'];
			Ems303ViewModel.data[i]['kamoku_cd'] = list[i]['kamoku_cd'];
			Ems303ViewModel.data[i]['kamoku_nm'] = list[i]['kamoku_nm'];
			
			//管理用
			Ems303ViewModel.data[i]['seq'] = i;
			
		}
	};
	/**
	 *
     * 全選択、全解除ボタンのイベント
	 *
     */
	Ems303ViewModel.setEvent = function()
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
	Ems303ViewModel.setConfMessage = function()
	{
		Ems303ViewModel.sendObj = [];
		var cnt = 0;
		var seq;
		
		//選択ONの受験生の整理番号を取得する
		
		for(var i = 0; i < Ems303ViewModel.data.length; i++){
			seq = '#c' + i;
			if ( $(seq).prop('checked') ) {
				Ems303ViewModel.sendObj[cnt] = {};
				Ems303ViewModel.sendObj[cnt]['juken_no'] = Ems303ViewModel.data[i]['juken_no'];
				Ems303ViewModel.sendObj[cnt]['kamoku_cd'] = Ems303ViewModel.data[i]['kamoku_cd'];
				cnt++;
			}
		}
			var result = stngcode.msg.ems303conf.replace( '{0}', cnt);
		return result
	};		
	/**
	 *
     * Submit処理
	 *
     */
	Ems303ViewModel.submit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems303prog2);
		
		// 送信情報を取得
		var list = {};
		
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['ketu_list'] = JSON.stringify(Ems303ViewModel.sendObj);
	
		$.ajax({
			url:stngcode.ajax.muSeisekiRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems303end, function() {
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
