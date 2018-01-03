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

		//分割処理のために保存
		Ems104ViewModel.syori = list.length;
		Ems104ViewModel.list = list;
		Ems104ViewModel.send_count = 0;

		//医学部一般入試のように単一学科で受験生が多い場合、学内LANからインターネットへの
		//通信で処理タイムアウト回避するため、分割して送信する
		Ems104ViewModel.exportDiv();
	};

	/**
	 *
   * 分割処理および終了判断と送信処理の起動
	 *
   */
	Ems104ViewModel.exportDiv = function()
	{
		var list = [];
		if (Ems104ViewModel.send_count < Ems104ViewModel.syori) {
			//未送信分が残っている場合
			var j = Ems104ViewModel.send_count;
			for (var i=0; i < stngcode.ajax.divUnit; i++) {
				if (j < Ems104ViewModel.syori) {
					list[i] = {};
					list[i] = Ems104ViewModel.list[j++];
				}
			}
			Ems104ViewModel.send_count = j;
			Ems104ViewModel.exportSend(list);
		} else {
			//すべて送信完了した場合
			cmncode.dlg.hideLoading();
			cmncode.dlg.alertMessageCB('確認', Ems104ViewModel.syori + stngcode.msg.ems104end,
				function (){
					location.reload();
				}
			);
		}
	};

	/**
	 *
	 * 分割した情報を送信する処理
	 * @parameter list1[] 送信対象情報リスト(分割済み）
	 */
	Ems104ViewModel.exportSend = function(list)
	{
		// 送信情報を取得
		var sendData = {};
		var siken_list = [];
		for (var i=0; i < list.length; i++) {
			var obj = {};
			obj['torihiki_id'] = list[i]['seiri_no'];
			obj['gakubu_cd'] = Login.gakubuCd;
			//整理SEQは試験区分コード+学科コードで構成されている
			var str = list[i]['seiri_seq'];
			obj['siken_cd'] = str.substr(0,1);
			obj['gakka_cd'] = str.substr(1,1);
			obj['juken_no'] = list[i]['juken_no'];
			obj['uketuke_stat'] = list[i]['uketuke_stat'];
			obj['kaijo_guide'] = list[i]['floor_nm'] + ' ' + list[i]['sikenjo_nm'];
			//以下はここでは設定しない
			obj['gohi_stat'] = '';
			obj['seiseki_json'] = '';
			siken_list.push(obj);
		}
		sendData['siken_list'] = JSON.stringify(siken_list);

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
						//未送信分をチェックする
						Ems104ViewModel.exportDiv();
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
				//cmncode.dlg.hideLoading();
			}
		});
	};

})();
