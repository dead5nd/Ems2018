/** 
* @fileOverview Ems302画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/5 試験データ一括入力形式でCSV出力を行う
*          採点対象CSV出力項目に理科選択情報を追加
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems302ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems302ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		//連動選択項目の処理
		Ems302ViewModel.kamokuSelect();
		Ems302ViewModel.jiSelect();
		
	};	
	/**
	 *
     * 1次2次選択の表示、非表示
	 *
     */
	Ems302ViewModel.jiSelect = function()
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
	Ems302ViewModel.kamokuSelect = function()
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
						Ems302ViewModel.sikentiSelect();
					} else {
						cmncode.template.bind("kamoku_Script", {"rows": []} , "kamoku_Tmpl");
						Ems302ViewModel.sikentiSelect();
					}
				} else {
					cmncode.dlg.alertMessage('エラー', data.err_msg);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
			},
			complete: function() {
				
			}
		});	
	};	
	/**
	 *
     * 試験地選択欄の更新
	 *
     */
	Ems302ViewModel.sikentiSelect = function()
	{
		
		// 送信情報を取得
		var sendData = {};	
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		
		$.ajax({
			url:stngcode.ajax.getSikentiUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						cmncode.template.bind("sikenti_Script", {"rows": data.srch_list} , "sikenti_Tmpl");
					} else {
						cmncode.template.bind("sikenti_Script", {"rows": []} , "sikenti_Tmpl");
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
     * 入力対象選択欄の更新
	 *
     */
	Ems302ViewModel.inpTargetSelect = function()
	{
		var inpTarget = $("#inpTarget").val();
		
		if (inpTarget == 'all') { //すべて
			var tagetClass = '.all-score';
		} else {
			var tagetClass = '.score' + inpTarget;
		}
		
		//一旦すべて入力不可にしてから対象欄のみ可能にする
		$(".all-score").prop('readOnly', true);
		$(tagetClass).prop('readOnly', false);
		
		//対象欄はEnterでフォーカス移動を行う
		$(document).off("keydown", ".all-score");
		$(document).on("keydown", tagetClass, function(e) {
	   		var c = e.which ? e.which : e.keyCode;
			switch (c) {
			case 13:
			case 39:
			case 40:
			  	var index = $(tagetClass).index(this);
		      	$(tagetClass + ":gt(" + index + "):first").focus();
		      	e.preventDefault();
				break;
			case 37:
			case 38:
			  	var index = $(tagetClass).index(this);
		      	$(tagetClass + ":lt(" + index + "):last").focus();
		      	e.preventDefault();
				break;
		    } 
	  	});
	
	};	
	/**
	 *
     * Search呼び出し処理
	 * 検索条件によって成績入力方式を判断
     */
	Ems302ViewModel.search = function()
	{
		//入力方式を判断して通信先を変更する
		Ems302ViewModel.checkInpType();
	};
	/**
	 *
     * Search実行処理
     */
	Ems302ViewModel.goSearch = function()
	{
		// 条件重複のチェック
		if ( ($("#cnt_juken_no").val() != '') && ($("#end_juken_no").val() != '') ) {
			cmncode.dlg.alertMessage('エラー', '件数と終了受験番号は、どちらかを指定してください');
			$(".cs-search").prop('disabled', false);
			return;
		}
		if (Login.gakubuCd == '2') { //医療科学部の場合
			if ( ($("#kamoku_cd").val() == '') && ($("#gakka_cd").val() == '') ) {
				cmncode.dlg.alertMessage('エラー', '学科または科目を指定してください');
				$(".cs-search").prop('disabled', false);
				return;
			}
		}
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems302prog2);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['kamoku_cd'] = $("#kamoku_cd").val();
		sendData['sikenti_cd'] = $("#sikenti_cd").val();
		sendData['12ji_kubun'] = $("#12ji_kubun").val();
		
		if ( cmncode.sikenti2ji($("#sikenti_cd").val()) ) {
			sendData['sikenti_cd'] = '';
			sendData['sikenti2_cd'] = $("#sikenti_cd").val();
		} else {
			sendData['sikenti_cd'] = $("#sikenti_cd").val();
			sendData['sikenti2_cd'] = '';
		}
		
		var yosi_no =  $("#yosi_no").val();
		if ( yosi_no != '') {
			sendData['yosi_no'] = ( '00'  + yosi_no ).slice( -2 );
		} else {
			sendData['yosi_no'] = yosi_no;
			
		}
		sendData['start_juken_no'] = cmncode.jnoToFull( $("#start_juken_no").val() );
		sendData['end_juken_no'] = cmncode.jnoToFull( $("#end_juken_no").val() );
		sendData['cnt_juken_no'] = $("#cnt_juken_no").val();
		
		//2次試験の際には、1次不合格者を対象外とする
		sendData['1jing_flg'] = ( sendData['12ji_kubun'] == '2') ? '1': '0';
		
		//解答用紙別の時だけ条件として有効にする
		if (Ems302ViewModel.inpType == 'kaitoyosi') {
			if ($("#ketu_flg").prop('checked')) {
				sendData['ketu_flg'] = '1';
			} else {
				sendData['ketu_flg'] = '0';
			}
		} else {
			sendData['ketu_flg'] = '0';
		}
		//足切除外する
		sendData['asikiri_flg'] = '1';
		
		
		//科目別一覧で受信データが多い場合にjquery templateでstack exceeded発生
		//するため例外処理実施
		$.ajax({
			url:Ems302ViewModel.url,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				try {
					// サーバからのデータを解析して表示する
					if (data.stat == 'OK') {
						if ('srch_list' in data) {
							if (data.srch_list.length > 0) {
								//受信データの編集処理
								if ($("#siken_cd").val() == 'P') { // センタープラスの場合別処理
									Slist.initPlus(data.srch_list); 
								} else {
									Slist.init(data.srch_list);
								}
								
								//設問数が多い場合は、カラム固定にする
								if ('q_list' in Slist.data.tr_list[0]) {
									if (Slist.data.tr_list[0].q_list.length > 7) {
										var colFix = true;
									} else {
										var colFix = false;
									}
								} else if ('k_list' in Slist.data.tr_list[0]) {
									if (Slist.data.tr_list[0].k_list.length > 7) {
										var colFix = true;
									} else {
										var colFix = false;
									}
								} else {
									var colFix = false;
								}
								
								if (colFix) {
									cmncode.template.bind(Ems302ViewModel.jQscriptFC, Slist.data , "table_Tmpl");
									$('#page01Table').DataTable({
										lengthChange: false,
										searching: false,
										sort: false,
										fixedHeader: true,
										scrollX: true,
										scrollY: 530,
										scrollCollapse: true,
										paging: false,
										fixedColumns:   {
											leftColumns: 2
										},
										displayLength: 3000,
										language: {
											url: stngcode.dataTableJpnUrl
										} 
									});
								} else {
									cmncode.template.bind(Ems302ViewModel.jQscript, Slist.data , "table_Tmpl");
									$('#page01Table').DataTable({
										lengthChange: false,
										searching: false,
										sort: false,
										fixedHeader: true,
										scrollY: 530,
										displayLength: 3000,
										language: {
											url: stngcode.dataTableJpnUrl
										} 
									});
									
								}
								
								//一覧CB、RBの初期表示
								Slist.CBRBinit();
								
								//入力対象欄の処理
								Ems302ViewModel.inpTargetSelect();
								
								//成績入力監視
								Ems302ViewModel.setChangeEvent();
								
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
				}
				catch (e) {
					cmncode.dlg.hideLoading();
					cmncode.dlg.alertMessage('エラー', '対象データ件数が多いため処理できません。<br>条件を絞り込んでください。');
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
     * 成績登録
	 *
     */
	Ems302ViewModel.submit = function()
	{
	
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems302prog3);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['kamoku_cd'] = $("#kamoku_cd").val();
		var yosi_no =  $("#yosi_no").val();
		if ( yosi_no != '') {
			sendData['yosi_no'] = ( '00'  + yosi_no ).slice( -2 );
		} else {
			sendData['yosi_no'] = yosi_no;
			
		}
		sendData['seiseki_list'] = Slist.sendData(); //送信対象をJSON形式で設定
		
		$.ajax({
			url: Ems302ViewModel.urlReg,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems302end, function() {
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
	
	/**
	 *
     * 成績入力方式の確認
	 * センタープラスの場合もここで判断する
     */
	Ems302ViewModel.checkInpType = function()
	{
		if ($("#siken_cd").val() == 'P') { //センタープラス
			Ems302ViewModel.url = stngcode.ajax.centerPlusUrl;
			Ems302ViewModel.urlReg = stngcode.ajax.kamokuSeisekiRegUrl;
			Ems302ViewModel.inpType = 'kamokuitiran';
			Ems302ViewModel.jQscript = 'table_Script2';
			Ems302ViewModel.jQscriptFC = 'table_Script2_FC';
			Ems302ViewModel.goSearch();
		} else if ($("#kamoku_cd").val() == '') { //全科目一覧
			Ems302ViewModel.url = stngcode.ajax.kamokuSeisekiUrl;
			Ems302ViewModel.urlReg = stngcode.ajax.kamokuSeisekiRegUrl;
			Ems302ViewModel.inpType = 'kamokuitiran';
			Ems302ViewModel.jQscript = 'table_Script2';
			Ems302ViewModel.jQscriptFC = 'table_Script2_FC';
			Ems302ViewModel.goSearch();
		} else {
			//サーバに入力方式の確認を行う
			var sendData = {};	
			sendData['kamoku_cd'] = $("#kamoku_cd").val();
			$.ajax({
				url:stngcode.ajax.typeSeisekiUrl,
				type: 'post',
				//contentType: false,
				timeout: stngcode.ajax.timeOut,
				data: sendData,
				dataType: 'json',
				success: function (data) {
					if (data.stat == 'OK') {
						if (data.hyoten_kubun == '2') { //段階評価
							Ems302ViewModel.url = stngcode.ajax.hyokaSeisekiUrl;
							Ems302ViewModel.urlReg = stngcode.ajax.hyokaSeisekiRegUrl;
							Ems302ViewModel.inpType = 'dankaihyoka';
							Ems302ViewModel.jQscript = 'table_Script3';
							Ems302ViewModel.jQscriptFC = 'table_Script3';
						} else { //解答用紙別
							Ems302ViewModel.url = stngcode.ajax.yosiSeisekiUrl;
							Ems302ViewModel.urlReg = stngcode.ajax.yosiSeisekiRegUrl;
							Ems302ViewModel.inpType = 'kaitoyosi';
							Ems302ViewModel.jQscript = 'table_Script';
							Ems302ViewModel.jQscriptFC = 'table_Script_FC';
						}
					} else {
						cmncode.dlg.alertMessage('エラー', data.err_msg);
						//エラーの場合は全科目一覧として処理を継続する
						Ems302ViewModel.url = stngcode.ajax.kamokuSeisekiUrl;
						Ems302ViewModel.urlReg = stngcode.ajax.kamokuSeisekiRegUrl;
						Ems302ViewModel.inpType = 'kamokuitiran';
						Ems302ViewModel.jQscript = 'table_Script2';
						Ems302ViewModel.jQscriptFC = 'table_Script2_FC';
					}
					Ems302ViewModel.goSearch();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
					//エラーの場合は全科目一覧として処理を継続する
					Ems302ViewModel.url = stngcode.ajax.kamokuSeisekiUrl;
					Ems302ViewModel.urlReg = stngcode.ajax.kamokuSeisekiRegUrl;
					Ems302ViewModel.inpType = 'kamokuitiran';
					Ems302ViewModel.jQscript = 'table_Script2';
					Ems302ViewModel.jQscriptFC = 'table_Script2_FC';
					Ems302ViewModel.goSearch();
				},
				complete: function() {
					
				}
			});	
		}

	};
	/**
	 *
     * 成績データ入力イベント処理
	 *
     */
	Ems302ViewModel.setChangeEvent = function()
	{
		$('input[name="watchTXT"]').change(function(e) {
			var target = $(e.target);
			Slist.editText(target);
		});
		
		$('input[name="watchCB"]').change(function(e) {
			var target = $(e.target);
			Slist.editCheckBox(target);
		});
		
		$('input[type="radio"]').change(function(e) {
			var target = $(e.target);
			Slist.editRadioBtn(target);
		});
	};
	
	/**
	 *
     * 採点対象者CSV出力処理
	 * 2017/5/5理科選択追加
     */
	Ems302ViewModel.export = function()
	{
		switch (Ems302ViewModel.inpType) {
		case 'kaitoyosi':
		case 'kamokuitiran':
			var content = '受験番号,氏名,学部,試験区分,物理選択,化学選択,生物選択\r\n';

			for (i=0; i < Slist.data.tr_list.length; i++) {
			
				content += '"'    + cmncode.jnoToShort( Slist.data.tr_list[i]['juken_no']);
				content +=  '","' + Slist.data.tr_list[i]['simei'];
				content +=  '","' + Login.gakubuCd;
				content +=  '","' + $("#siken_cd").val();
				content +=  '","' + Slist.data.tr_list[i]['buturi_ari'];
				content +=  '","' + Slist.data.tr_list[i]['kagaku_ari'];
				content +=  '","' + Slist.data.tr_list[i]['seibutu_ari'];
				content +=  '"\r\n';
			}
			break;
			
		case 'dankaihyoka':
			var content = '受験番号,氏名,学部,試験区分\r\n';

			for (i=0; i < Slist.data.tr_list.length; i++) {
			
				content += '"'    + cmncode.jnoToShort( Slist.data.tr_list[i]['juken_no']);
				content +=  '","' + Slist.data.tr_list[i]['simei'];
				content +=  '","' + Login.gakubuCd;
				content +=  '","' + $("#siken_cd").val();
				content +=  '"\r\n';
			}
			
			break;
			
		}
		var blob = Utf2Sjis.convert(content);

		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "採点対象者.csv"); 
		} else {
			document.getElementById("export").href = window.URL.createObjectURL(blob);
		}
		//location.reload();
		
	};
	
	/**
	 *
     * 試験データ一括入力形式でCSV出力を行う
	 * 2017/5/5新規追加
     */
	Ems302ViewModel.exportInputFormat = function()
	{
		var content = '';
		
		//入力対象の科目コード出力
		switch (Ems302ViewModel.inpType) {
		case 'kaitoyosi':
			content += $("#kamoku_cd").children(':selected').text();
			for (i=0; i < Slist.data.tr_list[0].q_list.length; i++) {
				content += ',';
				content += Slist.data.tr_list[0].q_list[i]['setumon_nm'];
			}
			content += '\r\n受験番号';
			for (i=0; i < Slist.data.tr_list[0].q_list.length; i++) {
				content += ',';
				content += $("#kamoku_cd").val();
				content += ( '00'  + $("#yosi_no").val() ).slice( -2 );
				content += ( '00'  + Slist.data.tr_list[0].q_list[i]['setumon_no'] ).slice( -2 );
			}
			content += '\r\n';
			break;
			
		case 'kamokuitiran':
			for (i=0; i < Slist.data.tr_list[0].k_list.length; i++) {
				content += ',';
				content += Slist.data.tr_list[0].k_list[i]['kamoku_nm_s'];
			}
			content += '\r\n受験番号';
			for (i=0; i < Slist.data.tr_list[0].k_list.length; i++) {
				content += ',';
				content += Slist.data.tr_list[0].k_list[i]['kamoku_cd'];
			}
			content += '\r\n';
			break;
			
		case 'dankaihyoka':
			content += $("#kamoku_cd").children(':selected').text();
			content += ',段階評価\r\n受験番号';
			content += ',';
			content += $("#kamoku_cd").val();
			content += '\r\n';
			break;
			
		}

		//入力対象受験番号出力
		for (i=0; i < Slist.data.tr_list.length; i++) {
			content += cmncode.jnoToShort( Slist.data.tr_list[i]['juken_no']);
			content += '\r\n';
		}

		var blob = Utf2Sjis.convert(content);

		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "成績入力.csv"); 
		} else {
			document.getElementById("exportInputFormat").href = window.URL.createObjectURL(blob);
		}
		//location.reload();
		
	};
})();
