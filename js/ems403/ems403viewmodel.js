/**
* @fileOverview Ems403画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/4 カナを半角にする
*          氏名の間に空白を入れる
*/

(function()
{
	/**
	 *
	 * コンストラクタ
	 *
	 */
	Ems403ViewModel = function()
	{
	};

	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems403ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		$("#downloadMessage").hide();
	};

	/**
	 *
     * Submit処理
	 *
     */
	Ems403ViewModel.submit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems403prog);

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		if ( $("#mi_renkei2").prop('checked') ) {
			sendData['mi_renkei'] = '1';
		} else {
			sendData['mi_renkei'] = '0';
		}

		$.ajax({
			url:stngcode.ajax.gakuExpUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//CSV出力メッセージ表示
						Ems403ViewModel.result_list = data.srch_list;
						$("#taisyo_cnt").text(data.srch_list.length);
						$("#downloadMessage").show();
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
     * CSV出力処理
	 *
     */
	Ems403ViewModel.export = function()
	{
		var content = '入試種別,受験番号,氏名,フリガナ,学校,所属,入学区分,修学区分,留年区分,学年,入学年度,本人・郵便番号,本人・住所１,本人・住所２,本人・電話番号,保護者・氏名,保護者・フリガナ,保護者・郵便番号,保護者・住所１,保護者・住所２,保護者・電話番号\r\n';

		//<<2018/12/13 ダブルクォーテーション削除
		for (var i = 0; i < Ems403ViewModel.result_list.length; i++) {
			content += ''    + Ems403ViewModel.result_list[i]['renkei1_cd'];
			//<<2017/5/4 6桁に変更
			//content +=  '","' + cmncode.jnoToShort(Ems403ViewModel.result_list[i]['juken_no']);
			content +=  ',' + Ems403ViewModel.result_list[i]['juken_no'];
			//>>
			//<<2017/5/4 半角スペース追加
			content +=  ',' + Ems403ViewModel.result_list[i]['kanji_simei_sei'] + ' ' + Ems403ViewModel.result_list[i]['kanji_simei_mei'];
			//>>
			//<<2017/5/4 全角→半角変換 半角スペース追加
			content +=  ',' + cmncode.kanaToHalf( Ems403ViewModel.result_list[i]['kana_simei_sei'] ) + ' ' + cmncode.kanaToHalf( Ems403ViewModel.result_list[i]['kana_simei_mei'] );
			//>>
			content +=  ',' + '1';
			content +=  ',' + Ems403ViewModel.result_list[i]['renkei2_cd'];
			content +=  ',' + '0';
			content +=  ',' + '0';
			content +=  ',' + '0';
			content +=  ',' + '1';
			content +=  ',' + cmncode.getNendo();
			content +=  ',' +  Ems403ViewModel.result_list[i]['yubin_no'];
			content +=  ',' +  Ems403ViewModel.result_list[i]['todohuken_nm'] + Ems403ViewModel.result_list[i]['siku_nm'];
			content +=  ',' +  Ems403ViewModel.result_list[i]['choban_nm'] + Ems403ViewModel.result_list[i]['sonota_nm'];
			content +=  ',' +  Ems403ViewModel.result_list[i]['tel_jitaku'];
			content +=  ',,,,,,\r\n';
		}

		var blob = Utf2Sjis.convert(content);

		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, "gakuno_export.csv");
		} else {
			document.getElementById("export").href = window.URL.createObjectURL(blob);
		}
		location.reload();

	};


})();
