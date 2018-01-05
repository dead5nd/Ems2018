/**
* @fileOverview Ems101画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/3 検索条件の追加
*          名前/受験番号/試験会場/終了整理番号の追加
*
* 2017/5/3 検索結果のCSV出力
*/

(function()
{
	/**
	 *
	 * コンストラクタ
	 *
	 */
	Ems101ViewModel = function()
	{
	};

	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems101ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		cmncode.template.bind("uketuke_Script", {"rows": cd.uketuke} , "uketuke_Tmpl");
		//<<2017/5/3
		cmncode.template.bind("sikenti_Script", {"rows": cd.kaijo[code]} , "sikenti_Tmpl");
		//>>
		// Data Picker初期化
		cmncode.datepickerInit(true);

		//受付状況の初期選択を書類未着にする
		$("#uketuke_stat").val('0');

	};

	//<<2017/5/3
	/**
	 *
     * 試験地選択欄の更新
	 *
     */
	Ems101ViewModel.sikentiSelect = function()
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
	//>>

	/**
	 *
     * Search処理
	 *
     */
	Ems101ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems101prog1);

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['s_no'] = $("#seiri_no").val();
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
		sendData['check_bi'] = $("#check_bi").val();
		sendData['ok_bi'] = $("#ok_bi_srch").val();

		//<<2017/5/3
		sendData['sikenti_cd'] = $("#sikenti_cd").val();
		sendData['s_no_end'] = $("#seiri_no_end").val();
		sendData['juken_no'] = cmncode.jnoToFull( $("#juken_no").val() );
		sendData['kanji_simei'] = $("#kanji_simei").val();
		sendData['kana_simei'] = $("#kana_simei").val();
		//>>

		$.ajax({
			url:stngcode.ajax.entChkUrl,
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
						Ems101ViewModel.checkSrchResult(data.srch_list);
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Clist.data} , "table_Tmpl");
						// Data Tables初期化(独自仕様での初期化）
						//cmncode.dataTablesInit(true,2);
						$('#page01Table').DataTable({
							searching: false,
							sort: true,
							fixedHeader: true,
							scrollY: 530,
							order:[[0,'asc']],
							displayLength: 50,
							columnDefs: [ {
						      targets: [4,6,9],
						      orderable: false
		   					 } ],
							language: {
								url: stngcode.dataTableJpnUrl
							}
						});

						// Date Picker再初期化
						cmncode.datepickerInit(true);

						//一覧初期設定
						Clist.init();

						//変更監視
						Ems101ViewModel.setChangeEvent();

						//フォーカス移動設定
						Ems101ViewModel.setFocusMove();

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
	Ems101ViewModel.checkSrchResult = function(list)
	{
		Clist.data = [];
		for (var i = 0; i < list.length; i++) {
			Clist.data[i] = {};
			Clist.data[i]['seiri_no'] = list[i]['seiri_no'];
			Clist.data[i]['seiri_seq'] = list[i]['seiri_seq'];
			Clist.data[i]['simei'] = list[i]['simei'];
			Clist.data[i]['ok_bi'] = list[i]['ok_bi'];
			Clist.data[i]['check_bi'] = list[i]['check_bi'];
			Clist.data[i]['biko'] = list[i]['biko'];
			Clist.data[i]['block_no'] = list[i]['block_no'];
			Clist.data[i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			Clist.data[i]['uketuke_stat'] = list[i]['uketuke_stat'];
			Clist.data[i]['syutugan_bi'] = list[i]['syutugan_bi'];
			Clist.data[i]['chosa_json1'] = list[i]['chosa_json1'];
			Clist.data[i]['gakubu_cd'] = Login.gakubuCd;
			Clist.data[i]['gakka_cd'] = $("#gakka_cd").val();
			Clist.data[i]['log'] = encodeURI(cmncode.getTime());
			//受付状況文言
			if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['OK']['cd']) {
				Clist.data[i]['M'] = stngcode.UKETUKE['OK']['name'];
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['NG']['cd']) {
				Clist.data[i]['M'] = stngcode.UKETUKE['NG']['name'];
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['CAN']['cd']) {
				Clist.data[i]['M'] = stngcode.UKETUKE['CAN']['name'];
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['OK2']['cd']) {
				Clist.data[i]['M'] = stngcode.UKETUKE['OK2']['name'];
			} else {
				Clist.data[i]['M'] = '';
			}

			//管理用
			Clist.data[i]['seq'] = i;
			Clist.data[i]['upd'] = '';

		}
	};
	/**
	 *
     * 入力対象選択欄の更新
	 *
     */
	Ems101ViewModel.setFocusMove = function()
	{
		var target = "input[name=uketuke_stat]";


		//対象欄はEnterでフォーカス移動を行う
		$(document).off("keydown", target);
		$(document).on("keydown", target, function(e) {
	   		var c = e.which ? e.which : e.keyCode;
			switch (c) {
			case 13:
			case 40:
			  	var index = $(target).index(this);
		      	$(target + ":gt(" + index + "):first").focus();
		      	e.preventDefault();
				break;
			case 38:
			  	var index = $(target).index(this);
		      	$(target + ":lt(" + index + "):last").focus();
		      	e.preventDefault();
				break;
		    }
	  	});

	};

	/**
	 *
     * Submit処理
	 *
     */
	Ems101ViewModel.submit = function(form)
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems101prog2);

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['uketuke_list'] = Clist.sendData(); //送信対象をJSON形式で設定

		$.ajax({
			url:stngcode.ajax.entChkRegUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessageCB('確認', stngcode.msg.ems101end1, function() {
						Ems101ViewModel.reSearch();
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
     * 調査書形式CSV出力処理
	 *
     */
	Ems101ViewModel.export = function()
	{
		//var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

		//
		// 可変タイトル数の取得
		//
		var title = '整理番号,氏名';
		//医療科学部向け
		if (Login.gakubuCd == '2') {
			title += ',評定平均,欠席日数';

		} else if (Login.gakubuCd == '3') {
			title += ',評定平均,評定段階,科目評定_国語,科目評定_数学,科目評定_理科,科目評定_英語,欠席1年,欠席2年,欠席3年,公欠日数';
		} else {
			var col = 0;
			if (Clist.data[0]['chosa_json1'] != '') {
				var chosa = Clist.data[i]['chosa_json1'];
				//医療科学部向け
				for (var key in chosa) {
					title += ',' + key;
					col++;
				}
			}
		}
		//
		// データ行の取得
		//
		var datas ='';
		for (var i = 0; i < Clist.data.length; i++) {
			datas += '"' + Clist.data[i]['seiri_no'] + '","' + Clist.data[i]['simei'] + '"';
			if (Clist.data[i]['chosa_json1'] != '') {
				var chosa = Clist.data[i]['chosa_json1'];
				//医療科学部向け
				if (Login.gakubuCd == '2') {
					datas += ',"' + chosa['評定平均'] + '"';
					datas += ',"' + chosa['欠席日数'] + '"';

				} else if (Login.gakubuCd == '3') {
					datas += ',"' + chosa['評定平均'] + '"';
					datas += ',"' + chosa['評定段階'] + '"';

					datas += ',"' + chosa['科目評定_国語'] + '"';
					datas += ',"' + chosa['科目評定_数学'] + '"';
					datas += ',"' + chosa['科目評定_理科'] + '"';
					datas += ',"' + chosa['科目評定_英語'] + '"';

					datas += ',"' + chosa['欠席1年'] + '"';
					datas += ',"' + chosa['欠席2年'] + '"';
					datas += ',"' + chosa['欠席3年'] + '"';
					datas += ',"' + chosa['公欠日数'] + '"';

				} else {
					for (var key in chosa) {
						datas += ',"' + chosa[key] + '"';
					}
				}
			} else {
				for (var j = 0; j <= col; j++) {
					datas += ',';
				}
			}
			datas += '\n';
		}
		var content = title + '\n' + datas;

		var blob = Utf2Sjis.convert(content);
		//var blob = new Blob([ bom, content ], { "type" : "text/csv" });
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, "entry_user.csv");
		} else {
			document.getElementById("export").href = window.URL.createObjectURL(blob);
		}
		//location.reload();

	};

	/**
	 *
     * 検索結果CSV出力処理
	 *
     */
	Ems101ViewModel.exportList = function()
	{
		//
		// 可変タイトル数の取得
		//
		var title = '出願日,書類確認日,整理番号,氏名,確認, OK確認日, ブロック番号,受験番号,備考';

		//
		// データ行の取得
		//
		var datas ='';
		for (var i = 0; i < Clist.data.length; i++) {
			datas += '"'  + Clist.data[i]['syutugan_bi'] + '"';
			datas += ',"' + Clist.data[i]['check_bi'] + '"';
			datas += ',"' + Clist.data[i]['seiri_no'] + '"';
			datas += ',"' + Clist.data[i]['simei'] + '"';
			datas += ',"' + Clist.data[i]['M'] + '"';
			datas += ',"' + Clist.data[i]['ok_bi'] + '"';
			datas += ',"' + Clist.data[i]['block_no'] + '"';
			datas += ',"' + Clist.data[i]['juken_no'] + '"';
			datas += ',"' + Clist.data[i]['biko'] + '"';

			datas += '\n';
		}
		var content = title + '\n' + datas;

		var blob = Utf2Sjis.convert(content);
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, "entry_list.csv");
		} else {
			document.getElementById("exportList").href = window.URL.createObjectURL(blob);
		}

	};
	/**
	 *
     * テキストBOXへの入力イベント処理
	 *
     */
	Ems101ViewModel.setChangeEvent = function()
	{
		$('input[name="uketuke_stat"]').change(function(e) {
			var target = $(e.target);
			Clist.edit(target);
		});
		$('input[name="ok_bi"]').change(function(e) {
			var target = $(e.target);
			Clist.edit(target);
		});
		$('input[name="biko"]').change(function(e) {
			var target = $(e.target);
			Clist.edit(target);
		});
	};

	/**
	 *
     * 再検索処理
	 *
     */
	Ems101ViewModel.reSearch = function()
	{
		// 検索条件入力有効
		$(".cs-search").prop('disabled', false);
		// 検索結果非表示
		$("#table_Tmpl").children().remove();
		// 検索画面開く
		$("#searchAccCollapse").collapse('show');
	};

	/**
	 *
     * 一覧再描画処理
	 *
     */
	Ems101ViewModel.listReDraw = function()
	{
		$("#table_Tmpl").children().remove();
		cmncode.template.bind("table_Script", {"rows": Clist.data} , "table_Tmpl");
		$('#page01Table').DataTable({
			searching: false,
			sort: true,
			fixedHeader: true,
			scrollY: 530,
			order:[[0,'asc']],
			displayLength: 50,
			columnDefs: [ {
			     targets: [4,6,9],
			     orderable: false
   			 } ],
			language: {
				url: stngcode.dataTableJpnUrl
			}
		});
		cmncode.datepickerInit(true);
		Clist.init();
		Ems101ViewModel.setChangeEvent();
	};
})();
