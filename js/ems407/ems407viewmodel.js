/**
* @fileOverview Ems407画面表示・ビジネスロジック
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
	Ems407ViewModel = function()
	{
	};

	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems407ViewModel.init = function()
	{
		//成績開示の対象を絞る
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.sikenKaiji[code]} , "siken_Tmpl");
		$("#downloadMessage").hide();
	};

	/**
	 *
   * Submit処理
	 * 不合格者の成績情報を検索する
	 *
   */
	Ems407ViewModel.submit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems407prog1);

		// 送信情報を取得
		var sql = "EXECUTE [db_owner].[SeisekiKaiji] N'gakubu_cd', N'siken_cd' ";
		var sendData = {};
		var siken_cd = $("#siken_cd").val();
		var gakubu_cd = Login.gakubuCd;

		sql = sql.replace('gakubu_cd', gakubu_cd);
		sql = sql.replace('siken_cd', siken_cd);
		sendData['sql'] = sql;

		$.ajax({
			url:stngcode.ajax.cmnSrchUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//成績情報を編集してインターネット出願へ連携する
						Ems407ViewModel.editSeiseki(data.srch_list);
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
				//cmncode.dlg.hideLoading();
			}
		});

	};
	/**
	 *
   * 取得した成績情報を連携用形式に編集する
	 *
	 * @parameter list[] 受信した成績情報
   */
	Ems407ViewModel.editSeiseki = function(list)
	{
		var edit_list = [];
		var o_key = '';
		var n_key = '';
		var seiseki = [];
		var obj = {};
		var seiseki_obj = {};

		for (var i=0; i < list.length; i++) {
			n_key = list[i]['c1'] + list[i]['c2'];
			if (o_key == '') {
				//最初の処理
				seiseki = [];
				obj = {};
				o_key = n_key;
				obj['seiri_no'] = list[i]['c1'];
				obj['seiri_seq'] = list[i]['c2'];
				obj['gohi_stat'] = list[i]['c4'];
				//科目別成績を格納
				seiseki_obj = {};
				seiseki_obj['gohi_stat'] = list[i]['c4'];
				seiseki_obj['kamoku_cd'] = list[i]['c7'];
				seiseki_obj['ms_score'] = list[i]['c8'];
				seiseki_obj['score'] = list[i]['c9'];
				seiseki_obj['ketu'] = list[i]['c10'];
				seiseki.push(seiseki_obj);
			} else if (o_key != n_key) {
				//JSON形式にして格納する
				obj['seiseki_json'] = Ems407ViewModel.jsonSeiseki(seiseki);
				edit_list.push(obj);
				//次の成績編集準備
				seiseki = [];
				obj = {};
				o_key = n_key;
				obj['seiri_no'] = list[i]['c1'];
				obj['seiri_seq'] = list[i]['c2'];
				obj['gohi_stat'] = list[i]['c4'];
				//科目別成績を格納
				seiseki_obj = {};
				seiseki_obj['gohi_stat'] = list[i]['c4'];
				seiseki_obj['kamoku_cd'] = list[i]['c7'];
				seiseki_obj['ms_score'] = list[i]['c8'];
				seiseki_obj['score'] = list[i]['c9'];
				seiseki_obj['ketu'] = list[i]['c10'];
				seiseki.push(seiseki_obj);
			} else {
				//科目別成績を格納
				seiseki_obj = {};
				seiseki_obj['gohi_stat'] = list[i]['c4'];
				seiseki_obj['kamoku_cd'] = list[i]['c7'];
				seiseki_obj['ms_score'] = list[i]['c8'];
				seiseki_obj['score'] = list[i]['c9'];
				seiseki_obj['ketu'] = list[i]['c10'];
				seiseki.push(seiseki_obj);
			}
		}
		//最終受験者分の処理
		if ('seiri_no' in obj) {
			//JSON形式にして格納する
			obj['seiseki_json'] = Ems407ViewModel.jsonSeiseki(seiseki);
			edit_list.push(obj);
		}

		//インターネット出願への連携を行う
		cmncode.dlg.hideLoading();
		Ems407ViewModel.export(edit_list);

	};
	/**
	 *
   * 成績情報をJSON形式に編集する
	 *
	 * @parameter seiseki 検索情報オブジェクト
   */
	Ems407ViewModel.jsonSeiseki = function(seiseki)
	{
		var list = [
			{kamoku:"英語", m_seiseki:"-", seiseki:"-"},
			{kamoku:"数学", m_seiseki:"-", seiseki:"-"},
			{kamoku:"物理", m_seiseki:"-", seiseki:"-"},
			{kamoku:"化学", m_seiseki:"-", seiseki:"-"},
			{kamoku:"生物", m_seiseki:"-", seiseki:"-"}
		];
		var list_ketu = [
			{kamoku:"英語", m_seiseki:"欠席", seiseki:""},
			{kamoku:"数学", m_seiseki:"欠席", seiseki:""},
			{kamoku:"物理", m_seiseki:"-", seiseki:""},
			{kamoku:"化学", m_seiseki:"-", seiseki:""},
			{kamoku:"生物", m_seiseki:"-", seiseki:""}
		];
		var base = {
			"英語":" 200",
			"数学":" 200",
			"物理":" 100",
			"化学":" 100",
			"生物":" 100"
		}
		var base_m = {
			"英語":"　80",
			"数学":" 100"
		}
		var ketuCode = '1'; //欠席

		var kamoku_nm;
		var json_str;

		//全欠席の場合、初期設定値をもとにJSON作成
		if (seiseki[0]['gohi_stat'] == ketuCode) {
			json_str = JSON.stringify(list_ketu);
			return json_str;
		}

		//成績データの存在するものだけスコアを置き換える
		for (var i=0; i < seiseki.length; i++) {
			if (seiseki[i]['kamoku_cd']) {
				kamoku_nm = cd.sikenKamoku[seiseki[i]['kamoku_cd']];
				for (var j=0; j < list.length; j++) {
					if (kamoku_nm == list[j]['kamoku']) {
						//マークシート得点
						if (seiseki[i]['ms_score']) {
							list[j]['m_seiseki'] = seiseki[i]['ms_score']+  ' /' + base_m[kamoku_nm];
						}
						//得点
						if (seiseki[i]['score']) {
							//マークシート得点が存在するものは合計とする
							if (seiseki[i]['ms_score']) {
								var num = parseInt(seiseki[i]['ms_score'], 10) + parseInt(seiseki[i]['score'], 10);
								list[j]['seiseki'] = num + ' / ' + base[kamoku_nm];
							} else {
								list[j]['seiseki'] = seiseki[i]['score'] + ' /' + base[kamoku_nm];
							}
						}
						//学科別欠席
						if (seiseki[i]['ketu'] == ketuCode) {
							list[j]['seiseki'] = '欠席';
						}
					}
				}
			}
		}
		//JSON形式に変換
		json_str = JSON.stringify(list);
		return json_str;

	};

	/**
	 *
   * 開示成績情報をインターネット出願へ連携する
	 *
	 * @parameter list1[] 送信対象情報リスト
   */
	Ems407ViewModel.export = function(list)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems407prog2);

		//分割処理のために保存
		Ems407ViewModel.syori = list.length;
		Ems407ViewModel.list = list;
		Ems407ViewModel.send_count = 0;

		//医学部一般入試のように単一学科で受験生が多い場合、学内LANからインターネットへの
		//通信で処理タイムアウト回避するため、分割して送信する
		Ems407ViewModel.exportDiv();
	};

	/**
	 *
   * 分割処理および終了判断と送信処理の起動
	 *
   */
	Ems407ViewModel.exportDiv = function()
	{
		var list = [];
		if (Ems407ViewModel.send_count < Ems407ViewModel.syori) {
			//未送信分が残っている場合
			var j = Ems407ViewModel.send_count;
			for (var i=0; i < stngcode.ajax.divUnit; i++) {
				if (j < Ems407ViewModel.syori) {
					list[i] = {};
					list[i] = Ems407ViewModel.list[j++];
				}
			}
			Ems407ViewModel.send_count = j;
			Ems407ViewModel.exportSend(list);
		} else {
			//すべて送信完了した場合
			cmncode.dlg.hideLoading();
			cmncode.dlg.alertMessageCB('確認', Ems407ViewModel.syori + stngcode.msg.ems407end,
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
	Ems407ViewModel.exportSend = function(list)
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
			obj['gohi_stat'] = list[i]['gohi_stat'];
			obj['seiseki_json'] = list[i]['seiseki_json'];
			//以下はここでは設定しない
			obj['juken_no'] = '';
			obj['uketuke_stat'] = '';
			obj['kaijo_guide'] = '';

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
						Ems407ViewModel.exportDiv();
				} else {
					cmncode.dlg.alertMessage('エラー', data.err_msg);
					// 検索条件入力有効
					$(".cs-search").prop('disabled', false);
					cmncode.dlg.hideLoading();
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
				// 検索条件入力有効
				$(".cs-search").prop('disabled', false);
				cmncode.dlg.hideLoading();

			},
			complete: function() {
				//cmncode.dlg.hideLoading();
			}
		});
	};

})();
