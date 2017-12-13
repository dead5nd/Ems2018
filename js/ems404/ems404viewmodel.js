/** 
* @fileOverview Ems404画面表示・ビジネスロジック
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
	Ems404ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems404ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
	};	
	
	/**
	 *
     * 検索の事務処理フェーズ確認
     */
	Ems404ViewModel.search = function()
	{
		Ems404ViewModel.goSearch();	
		/*
		var gakka_cd = $("#gakka_cd").val();
		
		StepChk.isThereStep(gakka_cd, '4', function () {//入学確定以外の存在チェック
			Ems404ViewModel.goSearch();	
		});
		*/
		
	};
	/**
	 *
     * Search処理
	 *
     */
	Ems404ViewModel.goSearch = function(form)
	{
		//if (StepChk.ret['cd'] != 4) {//入学確定以外が存在する
		//	cmncode.dlg.alertMessageCB('エラー', stngcode.msg.ems404error, function() {
		//				location.reload();
		//			});
		//} else {
		
			// 送信中のメッセージ表示
			cmncode.dlg.showLoading(stngcode.msg.ems404prog1);
			
			// 送信情報を取得
			var sendData = {};	
			sendData['nendo'] = cmncode.getNendo();
			sendData['gakubu_cd'] = Login.gakubuCd;
			sendData['nokin_stat'] = '7';
			sendData['dakuten'] = '1';
			
		
			$.ajax({
				url:stngcode.ajax.gnoSrchUrl,
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
							Ems404ViewModel.checkSrchResult(data.srch_list);
							
							//jqueryTemplateで画面を作る
							cmncode.template.bind("table_Script", {"rows": Ems404ViewModel.data} , "table_Tmpl");
							// Data Tables初期化
							$('#page01Table').DataTable({
								lengthChange: false,
								searching: false,
								sort: true,
								fixedHeader: true,
								scrollY: 530,
								order:[[0,'asc']],
								displayLength: 3000, 
								columnDefs: [ {
							      targets: [0],
							      orderable: false
			   					 } ],
								language: {
									url: stngcode.dataTableJpnUrl
								} 
							});
							
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
		//}
	};
	/**
	 *
     * 受信データの編集を行う
	 *
     */
	Ems404ViewModel.checkSrchResult = function(list)
	{
		Ems404ViewModel.data = [];
		var j = 0;
		var nendo = cmncode.getNendo();
		var gakka_cd = $("#gakka_cd").val();
		
		for (var i = 0; i < list.length; i++) {
			if (gakka_cd == '') { //指定なしの場合
				var taisyo = true;
			} else if (gakka_cd == list[i]['gakka_cd']) {
				var taisyo = true;
			} else {
				var taisyo = false;
			}
			
			if (taisyo) {
				Ems404ViewModel.data[j] = {};
				Ems404ViewModel.data[j]['gakuseki_no'] = Ems404ViewModel.setGno(nendo, list[i]['gakka_cd'], j+1);
				Ems404ViewModel.data[j]['kanji_simei'] = list[i]['kanji_simei'];
				Ems404ViewModel.data[j]['kana_simei'] = list[i]['kana_simei'];
				Ems404ViewModel.data[j]['birthday'] = list[i]['birthday'];
				Ems404ViewModel.data[j]['juken_no'] = list[i]['juken_no'];
				Ems404ViewModel.data[j]['gakka_cd'] = list[i]['gakka_cd'];
				j++;
			}
			
		}
	};
	
	/**
	 *
     * 学籍番号組み立て
	 *
     */
	Ems404ViewModel.setGno = function(nendo, gakka_cd, num)
	{
		var gakuji_no;
		
		var seq = ( '000' + num ).slice( -3 );
		gakuji_no = cd.gakuji_gakka[gakka_cd] + nendo.substr(1,4) + seq;
		
		return gakuji_no;
	};
	
	/**
	 *
     * 送信前の確認メッセージ組み立て
	 *
     */
	Ems404ViewModel.setConfMessage = function()
	{
		Ems404ViewModel.sendObj = [];
		var nendo = cmncode.getNendo();
		
		for(var i = 0; i < Ems404ViewModel.data.length; i++){
			Ems404ViewModel.sendObj[i] = {};
			Ems404ViewModel.sendObj[i]['juken_no'] = Ems404ViewModel.data[i]['juken_no'];
			Ems404ViewModel.sendObj[i]['gakuseki_no'] = Ems404ViewModel.data[i]['gakuseki_no'];
			Ems404ViewModel.sendObj[i]['gakka_cd'] = Ems404ViewModel.data[i]['gakka_cd'];
		}
			var result = stngcode.msg.ems404conf.replace( '{0}',  Ems404ViewModel.data.length);
		return result
	};		
	/**
	 *
     * Submit処理
	 *
     */
	Ems404ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems404prog2);
		
		// 送信情報を取得
		var list = {};
		
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['jno_list'] = JSON.stringify(Ems404ViewModel.sendObj);
	
		$.ajax({
			url:stngcode.ajax.gnoRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems404end,
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
