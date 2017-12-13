/** 
* @fileOverview Ems500画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/4 詳細表示に2次試験日の追加
*          試験会場は1次、2次に分けて表示、および修正を可能とする
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems500ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems500ViewModel.init = function()
	{
		//
		// URLから情報を取得する
		//
		var url = location.search;
		var page = location.pathname;
		var param  = url.split('?');
		if (param.length > 1) {
			params = param[1].split('&');
			
			var paramArray = [];
			for ( i = 0; i < params.length; i++ ) {
				neet = params[i].split("=");
				paramArray.push(neet[0]);
				paramArray[neet[0]] = neet[1];
			}
			if ('gakubu_cd' in paramArray) {
				Login.gakubuCd = paramArray['gakubu_cd'];
			}
			
			//URL直接アクセス時の対応
			/*
			if ('log' in paramArray) {
				var log = cmncode.decodeURI(paramArray['log']);
				var time_diff = Ems500ViewModel.getTimeDiff(log);
				if (time_diff > 5) { 
					window.location.href = stngcode.loginUrl;
				}
			} else {
				window.location.href = stngcode.loginUrl;
			}
			*/
		}
		
		//
		// 詳細情報を取得する
		//
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems500prog1);
		
		// 送信パラメータ設定
		var sendData = {};
		var seiri_no11 = '00000000000';
		
		sendData['nendo'] = cmncode.getNendo();
		
		if ('seiri_no' in paramArray) {
			seiri_no11 = paramArray['seiri_no'];
		}
		sendData['seiri_no'] = seiri_no11.substr(0,9);
		if (seiri_no11.length > 9) {
			sendData['seiri_seq'] = seiri_no11.substr(9);
		} else {
			sendData['seiri_seq'] = '';
		}
		
		if ('gakka_cd' in paramArray) {
			sendData['gakka_cd'] = paramArray['gakka_cd'];
		} else {
			sendData['gakka_cd'] = '';
		}
		//
		// 連携用に整理番号を保存
		//
		Ems500ViewModel.seiri_no = sendData['seiri_no'];
		Ems500ViewModel.seiri_seq = sendData['seiri_seq'];
		Ems500ViewModel.gakka_cd = sendData['gakka_cd'];
		
		$.ajax({
			url:stngcode.ajax.jgDetUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('renkei' in data) {
						
						//受信データの編集と画面への表示
						Ems500ViewModel.checkSrchResult(data);
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
	};	
	

	/**
	 *
     * 受信データを画面表示用に編集しjQueryTemplateで処理を行う
	 *
     */
	Ems500ViewModel.checkSrchResult = function(data)
	{

		//-----------------------------
		// WEB出願情報の編集
		//-----------------------------
		var renkei = [];
		var i = 0;
		//
		renkei[i] = {};
		renkei[i]['title'] = '整理番号';
		//先頭の9桁のみ
		//renkei[i++]['value'] = data.renkei['csv01'] + data.renkei['csv02'];
		renkei[i++]['value'] = data.renkei['csv01'];

		renkei[i] = {};
		renkei[i]['title'] = '氏名（カナ）';
		renkei[i++]['value'] = data.renkei['csv29'] + data.renkei['csv30'];
		
		renkei[i] = {};
		renkei[i]['title'] = '氏名';
		renkei[i++]['value'] = data.renkei['csv31'] + data.renkei['csv32'];
		
		renkei[i] = {};
		renkei[i]['title'] = '試験区分';
		renkei[i++]['value'] = data.renkei['csv10'];
		
		renkei[i] = {};
		renkei[i]['title'] = '志望学部';
		renkei[i++]['value'] = data.renkei['csv08'];
		
		renkei[i] = {};
		renkei[i]['title'] = '志望学科';
		renkei[i++]['value'] = data.renkei['csv12'];
		
		renkei[i] = {};
		renkei[i]['title'] = '第二志望学科';
		renkei[i++]['value'] = data.renkei['csv14'];
		
		//<<2017/5/4
		renkei[i] = {};
		renkei[i]['title'] = '二次試験日';
		renkei[i++]['value'] = data.renkei['csv19'];
		//>>
		
		renkei[i] = {};
		renkei[i]['title'] = '郵便番号';
		renkei[i++]['value'] = data.renkei['csv55'];
		
		renkei[i] = {};
		renkei[i]['title'] = '住所';
		renkei[i++]['value'] = data.renkei['csv57'] + data.renkei['csv58'] + data.renkei['csv59'] + data.renkei['csv60'];

		renkei[i] = {};
		renkei[i]['title'] = '電話（自宅）';
		renkei[i++]['value'] = data.renkei['csv50'];
		
		renkei[i] = {};
		renkei[i]['title'] = '電話（本人携帯）';
		renkei[i++]['value'] = data.renkei['csv51'];
		
		renkei[i] = {};
		renkei[i]['title'] = '電話（保護者）';
		renkei[i++]['value'] = data.renkei['csv52'];
		
		renkei[i] = {};
		renkei[i]['title'] = '電話（その他）';
		renkei[i++]['value'] = data.renkei['csv53'];
		
		renkei[i] = {};
		renkei[i]['title'] = 'メールアドレス';
		renkei[i++]['value'] = data.renkei['csv54'];
		
		renkei[i] = {};
		renkei[i]['title'] = '生年月日';
		renkei[i++]['value'] = data.renkei['csv33'];
		
		renkei[i] = {};
		renkei[i]['title'] = '性別';
		renkei[i++]['value'] = data.renkei['csv35'];
		
		renkei[i] = {};
		renkei[i]['title'] = '出身校';
		renkei[i++]['value'] = data.renkei['csv37'];
		
		renkei[i] = {};
		renkei[i]['title'] = '学科名';
		renkei[i++]['value'] = data.renkei['csv46'];
		
		renkei[i] = {};
		renkei[i]['title'] = '卒業年月';
		renkei[i++]['value'] = data.renkei['csv47'];
				
		cmncode.template.bind("table_Script1", {"rows": renkei} , "table_Tmpl1");
		
		//-----------------------------
		// 処理進捗確認用のパラメータ保存
		//-----------------------------
		Ems500ViewModel.siken_cd =  data.renkei['csv09'];
		Ems500ViewModel.gakka_cd =  data.renkei['csv11'];
		
		//-----------------------------
		// 全データJSONをサーバ送信用に保存
		//-----------------------------
		Ems500ViewModel.renkei=  data.renkei;
		
		
		//-----------------------------
		// 入試管理情報の編集
		//-----------------------------
		
		var nyusi = [];
		var i = 0;
		var str;
		
		nyusi[i] = {};
		nyusi[i]['title'] = '受験番号';
		nyusi[i++]['value'] = cmncode.jnoToShort(data.juken_no);
		
		nyusi[i] = {};
		nyusi[i]['title'] = '出願日';
		str = data.syutugan_bi;
		nyusi[i++]['value'] = str.replace('0:00:00', '');
		
		nyusi[i] = {};
		nyusi[i]['title'] = '入金日';
		str = data.nyukin_bi;
		nyusi[i++]['value'] = str.replace('0:00:00', '');
		
		nyusi[i] = {};
		nyusi[i]['title'] = '書類OK日';
		str = data.check_bi;
		nyusi[i++]['value'] = str.replace('0:00:00', '');
		
		nyusi[i] = {};
		nyusi[i]['title'] = '書類チェック日';
		str = data.ok_bi;
		nyusi[i++]['value'] = str.replace('0:00:00', '');
		
		nyusi[i] = {};
		nyusi[i]['title'] = '受験番号発行日';
		str = data.juken_no_bi;
		nyusi[i++]['value'] = str.replace('0:00:00', '');
		
		nyusi[i] = {};
		nyusi[i]['title'] = '受付備考';
		nyusi[i++]['value'] = data.biko;
		
		cmncode.template.bind("table_Script2", {"rows": nyusi} , "table_Tmpl2");
		
		
		//理科選択
		var rika = [];
		var i = 0;
		rika[i] = {};
		rika[i]['title'] = '物理';
		rika[i++]['value'] = 'buturi_ari';
		
		rika[i] = {};
		rika[i]['title'] = '化学';
		rika[i++]['value'] = 'kagaku_ari';
		
		rika[i] = {};
		rika[i]['title'] = '生物';
		rika[i++]['value'] = 'seibutu_ari';
		
		cmncode.template.bind("rika_Script", {"rows": rika} , "rika_Tmpl");
		
		if (data.renkei['csv23'] == '1') { $("#buturi_ari").prop('checked',true); }
		if (data.renkei['csv24'] == '1') { $("#kagaku_ari").prop('checked',true); }
		if (data.renkei['csv25'] == '1') { $("#seibutu_ari").prop('checked',true); }
		
		//国際適性試験免除フラグ
		var menjo = [];
		var i = 0;
		menjo[i] = {};
		menjo[i]['title'] = '国際適性試験免除フラグ';
		menjo[i++]['value'] = 'kokusai_menjo';
		
		cmncode.template.bind("menjo_Script", {"rows": menjo} , "menjo_Tmpl");
		
		if (data.renkei['csv27'] == '1') { $("#kokusai_menjo").prop('checked',true); }
		
		//状態選択
		var code = Login.gakubuCd;
		cmncode.template.bind("sikenti_Script", {"rows": cd.kaijo[code]} , "sikenti_Tmpl");
		//<<2017/5/4 
		cmncode.template.bind("sikenti2_Script", {"rows": cd.kaijo2[code]} , "sikenti2_Tmpl");
		//>>
		cmncode.template.bind("uketuke_Script", {"rows": cd.uketuke} , "uketuke_Tmpl");
		cmncode.template.bind("gohi_Script", {"rows": cd.gohi} , "gohi_Tmpl");
		cmncode.template.bind("nokin_Script", {"rows": cd.nokin} , "nokin_Tmpl");
		
		$("#sikenti_cd").val(data.renkei['csv16']);
		//<<2017/5/4 
		$("#sikenti2_cd").val(data.renkei['csv20']);
		//>>
		$("#uketuke_stat").val(data.uketuke_stat);
		$("#gohi_stat").val(data.gohi_stat);
		$("#nokin_stat").val(data.nokin_stat);
		//状態変更のチェックのために保存
		Ems500ViewModel.uketuke_stat = data.uketuke_stat;
		Ems500ViewModel.gohi_stat = data.gohi_stat;
		Ems500ViewModel.nokin_stat = data.nokin_stat;
		
		if (data.zaseki_warihuri == '1') {
			$("#zaseki_warihuri").val(data.zaseki_warihuri);
		} else {
			$("#zaseki_warihuri").val('');
		}
		
		//-----------------------------
		// 調査書情報の編集
		//-----------------------------
		var chosa = {};
		var vname = '';
		
		for (var key in data.chosa) {
			if (key == '評定平均') { vname = 'value1'; }
			if (key == '欠席日数') { vname = 'value2'; }
			if (key == '評定段階') { vname = 'value3'; }
			if (key == '欠席1年') { vname = 'value4'; }
			if (key == '公欠1年') { vname = 'value5'; }
			if (key == '欠席2年') { vname = 'value6'; }
			if (key == '公欠2年') { vname = 'value7'; }
			if (key == '欠席3年') { vname = 'value8'; }
			if (key == '公欠3年') { vname = 'value9'; }
			if (key == '欠席4年') { vname = 'value10'; }
			
			chosa[vname] = data.chosa[key]
			
		}
		cmncode.template.bind("table_Script3", chosa , "table_Tmpl3");
	};
	

	/**
	 *
     * 情報変更処理
	 *
     */
	Ems500ViewModel.submit = function(form)
	{

		

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['seiri_no'] = Ems500ViewModel.seiri_no;
		sendData['seiri_seq'] = Ems500ViewModel.seiri_seq;
		
		sendData['buturi_ari']  = $("#buturi_ari").prop('checked') ? '1': '';
		sendData['kagaku_ari']  = $("#kagaku_ari").prop('checked') ? '1': '';
		sendData['seibutu_ari'] = $("#seibutu_ari").prop('checked') ? '1': '';
		
		sendData['sikenti_cd'] = $("#sikenti_cd").val();
		sendData['gakka_cd'] = Ems500ViewModel.gakka_cd;
		sendData['zaseki_warihuri'] = $("#zaseki_warihuri").val();
		
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
		sendData['gohi_stat'] = $("#gohi_stat").val();
		sendData['nokin_stat'] = $("#nokin_stat").val();
		
		sendData['kokusai_menjo'] = $("#kokusai_menjo").prop('checked') ? '1': '';
		
		//<<2017/5/4
		sendData['sikenti2_cd'] = $("#sikenti2_cd").val();
		//>>
		
		//全データJSONの更新
		Ems500ViewModel.renkei['csv16'] = $("#sikenti_cd").val();
		//<<2017/5/4
		Ems500ViewModel.renkei['csv20'] = $("#sikenti2_cd").val();
		//>>
		Ems500ViewModel.renkei['csv23'] = $("#buturi_ari").prop('checked') ? '1': '';
		Ems500ViewModel.renkei['csv24'] = $("#kagaku_ari").prop('checked') ? '1': '';
		Ems500ViewModel.renkei['csv25'] = $("#seibutu_ari").prop('checked') ? '1': '';
		Ems500ViewModel.renkei['csv27'] = $("#kokusai_menjo").prop('checked') ? '1': '';
		sendData['all_json'] = JSON.stringify(Ems500ViewModel.renkei);
			
		
		//状態変更は同時にできないのでここでチェックする
		var cnt = 0;
		/*
		if ($("#uketuke_stat").val() == Ems500ViewModel.uketuke_stat) {
			sendData['uketuke_stat'] = '';
		} else {
			cnt++;
		}
		if ($("#gohi_stat").val() == Ems500ViewModel.gohi_stat) {
			sendData['gohi_stat'] = '';
		} else {
			cnt++;
		}
		if ($("#nokin_stat").val() == Ems500ViewModel.nokin_stat) {
			sendData['nokin_stat'] = '';
		} else {
			cnt++;
		}
		*/
		if (cnt > 1) {
			cmncode.dlg.alertMessage('エラー', '複数の状況を同時に変更できません');
		} else {
			// 送信中のメッセージ表示
			cmncode.dlg.showLoading(stngcode.msg.ems500prog2);
			$.ajax({
				url:stngcode.ajax.jgUpdUrl,
				type: 'post',
				//contentType: false,
				timeout: stngcode.ajax.timeOut,
				data: sendData,
				dataType: 'json',
				success: function (data) {
					// サーバからのデータを解析して表示する
					if (data.stat == 'OK') {
						cmncode.dlg.alertMessage('確認', stngcode.msg.ems500end1);

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
     * 出願キャンセル
	 *
     */
	Ems500ViewModel.syutuganCancel = function(form)
	{

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['seiri_no'] = Ems500ViewModel.seiri_no;
		sendData['seiri_seq'] = Ems500ViewModel.seiri_seq;
	
		$.ajax({
			url:stngcode.ajax.jgCanUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems500end2);

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
     * 受験番号キャンセル前に
	 * 事務処理フェーズをチェック
	 *
     */
	Ems500ViewModel.jukenCalcelPre = function()
	{

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = Ems500ViewModel.siken_cd;
		sendData['gakka_cd'] = Ems500ViewModel.gakka_cd;
	
		$.ajax({
			url:stngcode.ajax.stepChkUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if (data.sinchoku_cd == '1') { //受付状態ならOK
						Ems500ViewModel.jukenCalcel();
					} else {
						cmncode.dlg.alertMessage('エラー', '受付状態でないでのキャンセルできません');
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
     * 受験番号キャンセル
	 *
     */
	Ems500ViewModel.jukenCalcel = function(form)
	{

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['seiri_no'] = Ems500ViewModel.seiri_no;
		sendData['seiri_seq'] = Ems500ViewModel.seiri_seq;

	
		$.ajax({
			url:stngcode.ajax.jnoCanUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems500end3);

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
     * 座席手動割振
	 *
     */
	Ems500ViewModel.syudoWarihuri = function(form)
	{
		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['seiri_no'] = Ems500ViewModel.seiri_no;
		sendData['seiri_seq'] = Ems500ViewModel.seiri_seq;

	
		$.ajax({
			url:stngcode.ajax.seatManuUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems500end4);

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
     * 調査書情報の登録
	 *
     */
	Ems500ViewModel.chosaToroku = function()
	{
		//画面入力データを登録用に編集する
		var chosa = {};
		
		chosa['評定平均'] = $("#value1").val();
		chosa['欠席日数'] = $("#value2").val();
		chosa['評定段階'] = $("#value3").val();
		chosa['欠席1年'] = $("#value4").val();
		chosa['公欠1年'] = $("#value5").val();
		chosa['欠席2年'] = $("#value6").val();
		chosa['公欠2年'] = $("#value7").val();
		chosa['欠席3年'] = $("#value8").val();
		chosa['公欠3年'] = $("#value9").val();
		chosa['欠席4年'] = $("#value10").val();
		
		//汎用更新処理を利用する
		
		var sql = "update t_uketuke set chosa_json1 ='" + JSON.stringify( chosa ) + "' ";
		var cond = "where nendo='" + cmncode.getNendo() + "' and seiri_no='" + Ems500ViewModel.seiri_no + "' and seiri_seq='" + Ems500ViewModel.seiri_seq + "'";
		var sendData = {};
		sendData['sql'] = sql + cond;

	
		$.ajax({
			url:stngcode.ajax.cmnUpdUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems500end5);

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
     * 現在日時との時間差(秒)取得
	 *
     */	
	Ems500ViewModel.getTimeDiff = function(date1Str)
	{
		var date2Str = cmncode.getTime();
		var date1 = new Date(date1Str);
		var date2 = new Date(date2Str);
		 
		// getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
		var msDiff = date2.getTime() - date1.getTime();

		// 求めた差分（ミリ秒）を分へ変換（経過ミリ秒÷(1000ミリ秒 * 60秒)。端数切り捨て）
		var timeDiff = Math.floor(msDiff / (1000 * 60));

		return timeDiff;
		
	};
})();
