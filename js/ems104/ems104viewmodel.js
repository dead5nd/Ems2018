/**
* @fileOverview Ems104画面表示・ビジネスロジック
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
	Ems104ViewModel = function()
	{
	};

	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems104ViewModel.init = function()
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
	Ems104ViewModel.submit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems104prog1);

		// 送信情報を取得
		var sendData = {};
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();

		$.ajax({
			url:stngcode.ajax.webExpUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//受験番号情報を編集してインターネット出願へ連携する
						Ems104ViewModel.export(data.srch_list);
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
     * 入試管理から抽出した受験番号情報を編集してインターネット出願へ連携する
	 *
	 * @parameter list1[] 送信対象情報リスト
     */
	Ems104ViewModel.export = function(list)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems104prog2);

		// 送信情報を取得
		var sendData = {};
		var siken_list = [];
		for (var i=0; i < list.length; i++) {
			var obj = {};
			obj['torihiki_id'] = list[i]['seiri_no'];
			obj['gakubu_cd'] = Login.gakubuCd;;
			//整理SEQは試験区分コード+学科コードで構成されている
			var str = list[i]['seiri_seq'];
			obj['siken_cd'] = str.substr(0,1);
			obj['gakka_cd'] = str.substr(1,1);
			obj['juken_no'] = list[i]['juken_no'];
			obj['uketuke_stat'] = list[i]['uketuke_stat'];
			//ToDo: obj['kaijo_guide'] = list[i]['floor_nm'] + ' ' + list[i]['sikenjo_nm'];
			//以下はここでは設定しない
			obj['gohi_stat'] = '';
			obj['seiseki_json'] = '';
			siken_list.push(obj);
		}
		sendData['siken_list'] = JSON.stringify(siken_list);

		//処理件数表示用
		var syori = list.length;

		$.ajax({
			url:stngcode.inet.inetDiffGetUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
						cmncode.dlg.alertMessageCB('確認', syori + stngcode.msg.ems104end,
							function (){
								location.reload();
							}
						);
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


})();
