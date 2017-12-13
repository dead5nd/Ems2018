/** 
* @fileOverview Ems501画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/4 座席手動設定者の検索条件を追加
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems501ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems501ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		cmncode.template.bind("sikenti_Script", {"rows": cd.kaijo[code]} , "sikenti_Tmpl");
		cmncode.template.bind("uketuke_Script", {"rows": cd.uketuke} , "uketuke_Tmpl");
		cmncode.template.bind("gohi_Script", {"rows": cd.gohi} , "gohi_Tmpl");
		cmncode.template.bind("nokin_Script", {"rows": cd.nokin} , "nokin_Tmpl");
	};	
	
	/**
	 *
     * 試験地選択欄の更新
	 *
     */
	Ems501ViewModel.sikentiSelect = function()
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
	 *
     * Search処理
	 *
     */
	Ems501ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems501prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['sikenti_cd'] = $("#sikenti_cd").val();
		
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
		sendData['gohi_stat'] = $("#gohi_stat").val();
		sendData['nokin_stat'] = $("#nokin_stat").val();
		sendData['heigan_seq'] = $("#heigan_seq").val();
		
		var seiri_no11 = $("#seiri_no").val();
		sendData['seiri_no'] = seiri_no11.substr(0,9);
		if (seiri_no11.length > 9) {
			sendData['seiri_seq'] = seiri_no11.substr(9);
		} else {
			sendData['seiri_seq'] = '';
		}
		sendData['juken_no'] = cmncode.jnoToFull( $("#juken_no").val() );
		sendData['kanji_simei'] = $("#kanji_simei").val();
		sendData['kana_simei'] = $("#kana_simei").val();
		sendData['det_req'] = '1'; //詳細情報必要
		sendData['dai2_kubun'] = $("#dai2_kubun").val();
		
		//<<2017/5/4
		sendData['zaseki_warihuri'] = $("#zaseki_warihuri").val();
		//>>
		
		//受験番号未発行を選択した場合に受付状況が「選択なし」なら書類OKを条件に追加する
		sendData['juken_stat'] = $("#juken_stat").val();
		if (sendData['juken_stat'] == '0') {
			if (sendData['uketuke_stat'] == '') {
				sendData['uketuke_stat'] = '1';
			}
		}
	
		$.ajax({
			url:stngcode.ajax.jgRefUrl,
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
						Ems501ViewModel.checkSrchResult(data.srch_list);
						
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Ems501ViewModel.result_list} , "table_Tmpl");
						// Data Tables初期化
						cmncode.dataTablesInit(true,0);
						
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
	Ems501ViewModel.checkSrchResult = function(list)
	{
		var json = sessionStorage.getItem('login');
		var after_list = [];
		for (var i = 0; i < list.length; i++) {
			after_list[i] = {};
			after_list[i]['seiri_no'] = list[i]['seiri_no'];
			after_list[i]['seiri_no_short'] = cmncode.seiriToShort( list[i]['seiri_no'] );
			after_list[i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			after_list[i]['juken_no_full'] = list[i]['juken_no'];
			after_list[i]['simei'] = list[i]['simei'];
			after_list[i]['uketuke'] = list[i]['uketuke'];
			after_list[i]['gohi'] = list[i]['gohi'];
			after_list[i]['nokin'] = list[i]['nokin'];
			after_list[i]['heigan_seq'] = list[i]['heigan_seq'] == '0' ? '' : list[i]['heigan_seq'];
			after_list[i]['gakka_cd'] = list[i]['gakka_cd'];
			after_list[i]['gakubu_cd'] = Login.gakubuCd;
			after_list[i]['log'] = encodeURI(cmncode.getTime());
			after_list[i]['renkei'] = list[i]['renkei'];
			after_list[i]['chosa'] = list[i]['chosa'];
			after_list[i]['gakuseki_no'] = list[i]['gakuseki_no'];
		}
		
		Ems501ViewModel.result_list = after_list;
	};
	

	/**
	 *
	* Submit処理(一括登録ファイルアップロード）
	 *
     */
	Ems501ViewModel.submit = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems501prog2);

		// 送信情報を取得
		$("#nendo").val(cmncode.getNendo());
		var fd = new FormData(form);
	
		$.ajax({
			url:stngcode.ajax.jgImpUrl,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', data.syori + stngcode.msg.ems501end);

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
	 * 学事連携CSV出力処理(CR+LF)
	 *
     */
	Ems501ViewModel.export1 = function()
	{
		//var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var gakka_cd;
		var senko_cd;
		
		var content = '学科コード,専攻コード,学籍番号,受験番号,氏名（セイ）,氏名（メイ）,氏名（姓）,氏名（名）,性別コード,生年月日,郵便番号,都道府県コード,都道府県名,市郡区,町番地,マンションなど,';
			content +='電話（本人携帯）,卒業年月,高校コード,修学年,入試別,年度\r\n';
		for (var i = 0; i < Ems501ViewModel.result_list.length; i++) {
			//学科コードを学事用に変換
			gakka_cd = cd.gakuji_gakka[ Ems501ViewModel.result_list[i]['gakka_cd'] ];
			
			//専攻コードを学事用に変換
			if (gakka_cd == '44') {
				senko_cd = '4401';
			} else if (gakka_cd == '45') {
				senko_cd = '4501';
			} else {
				senko_cd = '9999';
			}
			
			content += '"'   + gakka_cd;
			content += '","' + senko_cd;
			content += '","' + Ems501ViewModel.result_list[i]['gakuseki_no'];
			content += '","' + Ems501ViewModel.result_list[i]['juken_no_full'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv29'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv30'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv31'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv32'];
			content += '","' + cd.gakuji_seibetu[ Ems501ViewModel.result_list[i]['renkei']['csv34'] ];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv33'];
				
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv55'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv56'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv57'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv58'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv59'];
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv60'];
				
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv51'];
			content += '","' +cmncode.ym2ymd( Ems501ViewModel.result_list[i]['renkei']['csv47'] );
			content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv36'];
			
			content += '","' + cd.gakuji_syugakunen[ Ems501ViewModel.result_list[i]['gakka_cd'] ];
			content += '","' + cd.gakuji_siken[ Ems501ViewModel.result_list[i]['renkei']['csv09'] ];
			content += '","' + cmncode.getNendo();
			
			content += '"\r\n';
		}
		//var blob = new Blob([ bom, content ], { "type" : "text/csv" });
		var blob = Utf2Sjis.convert(content);
		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "gakuji_export.csv"); 
		} else {
			document.getElementById("export1").href = window.URL.createObjectURL(blob);
		}
		location.reload();
		
	};
		
	/**
	 *
     * 検索結果CSV出力処理
	 *
     */
	Ems501ViewModel.export2 = function()
	{
		//var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		//学部仕様で出力を分ける
		if (Login.gakubuCd == '2') {
			var chosa1 = '';
			var chosa2 = '';
			var content = '整理番号,受験番号,国際適性試験の免除申請者のフラグ,試験地,大学入試センター試験成績請求番号,姓,名,セイ,メイ,性別,生年月日,試験区分,志望学科,第二志望学科,出身県,設置区分名,高校コード,高校名,学科,卒業年月,評定平均,欠席日数,追加出願整理番号,郵便番号,都道府県,市区郡,町番地,マンション\n';
			for (var i = 0; i < Ems501ViewModel.result_list.length; i++) {
				content += '"'   + Ems501ViewModel.result_list[i]['seiri_no'];
				content += '","' + Ems501ViewModel.result_list[i]['juken_no'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv27'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv17'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv28'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv31'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv32'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv29'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv30'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv35'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv33'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv10'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv12'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv14'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv40'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv42'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv36'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv37'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv46'];
				content += '","' + cmncode.ym2ymd( Ems501ViewModel.result_list[i]['renkei']['csv47'] );
				chosa1 = '';
				chosa2 = '';
				for (var key in Ems501ViewModel.result_list[i]['chosa']) {
					if (key == '評定平均') {
						chosa1 =  Ems501ViewModel.result_list[i]['chosa']['評定平均'];
					} 
					if (key == '欠席日数') {
						chosa2 =  Ems501ViewModel.result_list[i]['chosa']['欠席日数'];
					} 
				}
				content += '","' + chosa1;
				content += '","' + chosa2;
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv04'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv62'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv64'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv65'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv66'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv67'];
				content += '"\n';
			}
		} else {
			var content = '整理番号,受験番号,姓,名,セイ,メイ,性別,生年月日,試験区分,志望学科,第二志望学科,出身県,設置区分名,高校コード,高校名,学科,卒業年月,調査1,調査2\n';
			for (var i = 0; i < Ems501ViewModel.result_list.length; i++) {
				content += '"'   + Ems501ViewModel.result_list[i]['seiri_no'];
				content += '","' + Ems501ViewModel.result_list[i]['juken_no'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv31'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv32'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv29'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv30'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv35'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv33'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv10'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv12'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv14'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv40'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv42'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv36'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv37'];
				content += '","' + Ems501ViewModel.result_list[i]['renkei']['csv46'];
				content += '","' + cmncode.ym2ymd( Ems501ViewModel.result_list[i]['renkei']['csv47'] );
				for (var key in Ems501ViewModel.result_list[i]['chosa']) {
					content += '","' + Ems501ViewModel.result_list[i]['chosa'][key];
				}
				content += '"\n';
			}
		}
		//var blob = new Blob([ bom, content ], { "type" : "text/csv" });
		var blob = Utf2Sjis.convert(content);
		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "jmember_export.csv"); 
		} else {
			document.getElementById("export2").href = window.URL.createObjectURL(blob);
		}
		location.reload();
		
	};
	
	
})();
