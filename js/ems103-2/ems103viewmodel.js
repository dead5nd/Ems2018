/**
* @fileOverview Ems103画面表示・ビジネスロジック
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
	Ems103ViewModel = function()
	{
	};

	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems103ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");

		// Data Picker初期化
		cmncode.datepickerInit(true);
	};


	/**
	 *
     * インターネット出願システムから出願情報を取得
	 *
     */
	Ems103ViewModel.getImportData = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems103prog);

		// 送信情報を取得
		var sendData = {};

		var sql = "SELECT  s.torihiki_id, s.gakubu_cd, s.siken_cd, s.gakka_cd, s.gakka2_cd, s.sikenbi_1ji, s.sikenti_1ji_cd, s.sikenbi_2ji, s.sikenti_2ji_cd, s.buturi_ari, ";
		sql = sql + "s.kagaku_ari, s.seibutu_ari,s.tiiki_ari,s.kokusai_menjyo,s.center_seikyu_no,";
		sql = sql + "u.kana_simei_sei, u.kana_simei_mei, u.kanji_simei_sei, u.kanji_simei_mei, u.birthday, u.seibetu_cd, u.seibetu_nm, u.school_cd, u.school_nm, u.school_nm_other, ";
		sql = sql + "u.school_ken_cd, u.school_ken_nm, u.school_type_cd, u.school_type_nm, u.school_katei_cd, u.school_katei_nm, u.school_gakka_cd, u.school_gakka_nm, u.sotugyo_ym,u.tel1, ";
		sql = sql + "u.tel2, u.tel3, u.tel4, u.email, u.yubin_no, u.ken_cd, u.ken_nm, u.siku_nm, u.choban_nm, u.sonota_nm,u.yubin2_no, u.ken2_cd, u.ken2_nm, u.siku2_nm, u.choban2_nm, ";
		sql = sql + "u.sonota2_nm, e.entry_ymd, e.nyukin_ymd, u.rireki_json, u.sibo_json, u.change_json, u.photo_image ";
		sql = sql + "FROM t_siken s INNER JOIN t_user u ON u.email = s.email INNER JOIN t_entry e ON e.torihiki_id = s.torihiki_id ";
		var cond = "WHERE s.gakubu_cd = '" + Login.gakubuCd + "' AND e.nyukin_stat = '1' ";

		var siken_cd =  $("#siken_cd").val();
		var entry_date_s = $("#entry_date_s").val();
		var entry_date_e = $("#entry_date_e").val();
		var torihiki_id = $("#torihiki_id").val();

		if (siken_cd) {
			cond = cond + "AND s.siken_cd = '" + siken_cd + "' ";
		}
		if (entry_date_s) {
			cond = cond + "AND u.updatetime >= '" + entry_date_s + " 00:00:00' ";
		}
		if (entry_date_e) {
			cond = cond + "AND u.updatetime <= '" + entry_date_e + " 23:59:59' ";
		}
		if (torihiki_id) {
			cond = cond + "AND s.torihiki_id = '" + torihiki_id + "' ";
		}

		sql = sql + cond + ";";

		sendData['sql'] = sql;

		var reqdate = cmncode.getTimeStr();
		sendData['email'] = stngcode.inet.Email;
		sendData['reqdate'] = reqdate;
		sendData['hash'] = cmncode.getLoginHash( stngcode.inet.Email, reqdate, stngcode.inet.Token );

		$.ajax({
			url:stngcode.inet.inetHanyoUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			//jsonpCallback: 'callback',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//CSVファイルイメージ作成
						Ems103ViewModel.exportCSV(data.srch_list);
					} else {
						cmncode.dlg.alertMessage('エラー', stngcode.msg.ems103error);
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
     * 検索結果CSV出力処理
	 *
     */
	Ems103ViewModel.exportCSV = function(list)
	{
		// 送信中のメッセージ表示
		//cmncode.dlg.showLoading(stngcode.msg.ems103prog);

		//
		// 可変タイトル数の取得
		//
		var title = '整理番号,連番,"処理コード","追加出願整理番号",受験番号,内部コード,"学部コード",学部名,"試験区分コード",試験区分名,"志望学科コード",志望学科名,"第二志望学科コード",第二志望学科名,一次試験日,一次試験地コード,"一次試験地名","一次試験会場名","二次試験日","二次試験地コード",二次試験地名,二次試験会場名,物理フラグ,化学フラグ,生物フラグ,地域枠フラグ,国際適性試験免除フラグ,"大学入試センター試験成績請求番号",氏名（セイ）,氏名（メイ）,氏名（姓）,氏名（名）,生年月日,"性別コード",性別,高校コード,高校名,他高校名,都道府県コード（高校）,都道府県名（高校）,設置区分コード,設置区分名,課程コード,課程名,学科コード,学科名,卒業年月,卒業区分コード,卒業区分名,電話（自宅）,電話（本人携帯）,電話（保護者）,電話（その他）,メールアドレス,郵便番号,都道府県コード（本人）,都道府県名（本人）,市郡区,町番地,マンションなど,合格通知など送付先-同一住所チェック,合格通知など送付先-郵便番号,合格通知など送付先-都道府県コード,合格通知など送付先-都道府県,合格通知など送付先-市区郡,合格通知など送付先-町番地,合格通知など送付先-マンションなど,出願日時,出願方法コード,出願方法,検定料,振込種別タイプ,決済方法コード,決済方法名,入金期限,入金状況コード,入金状況名,入金日,振込金額,消込日時,コンビニ・ATM:オンライン決済番号,コンビニ・ATM:CVS本部コード,コンビニ・ATM:CVS本部コード名称,コンビニ・ATM:店舗コード,コンビニ・ATM:店舗コード名称,1 本学を知ったのはいつ頃ですか？,2 本学を志望校として決定したのはいつ頃ですか？,3 本学を志願するうえで、本学の情報を得るために参考になったものは？（複数回答可）,4 本学の広告で見たことがある媒体を教えてください（複数回答可）,4 「その他」にチェックをつけた方。：,5 本学で開催しているオープンキャンパスやキャンパス見学会、個別進学相談会に参加したことがありますか？,6 本学以外の会場（高校やイベント会場等）で開催している進学相談会で、本学の説明を受けたことがありますか？,7 本学に受験を決めたポイントを教えてください。（複数回答可）,7 「その他」にチェックをつけた方。：,履歴書情報JSON,志望理由JSON,変更項目JSON,写真ファイル名';

		//
		// データ行の取得
		//
		var datas ='';
		for (var i = 0; i < list.length; i++) {
			//1次試験日はyyyy/mm/dd のみで登録(センターは片方のみ）
			var tmp_str = list[i]['6'];
			tmp_str = tmp_str.substr(0,10);

			datas += '"'  + list[i]['1'] + '"';
			datas += ',"'  + list[i]['3'] + list[i]['4'] + '"'; //試験区分＋学科を連番とする
			datas += ',0,0,0,0';
			datas += ',"' + list[i]['2'] + '"';
			datas += ',"' + Ems103ViewModel.getGakubuName( list[i]['2'] ) + '"';
			datas += ',"' + list[i]['3'] + '"';
			datas += ',"' + Ems103ViewModel.getSikenName( list[i]['2'] + list[i]['3'] ) + '"';
			datas += ',"' + list[i]['4'] + '"';
			datas += ',"' + Ems103ViewModel.getGakkaName( list[i]['4'] ) + '"';
			datas += ',"' + list[i]['5'] + '"';
			datas += ',"' + Ems103ViewModel.getGakkaName( list[i]['5'] ) + '"';
			datas += ',"' + tmp_str + '"';
			datas += ',"' + list[i]['7'] + '"';
			datas += ',0,0';
			datas += ',"' + list[i]['8'] + '"';
			datas += ',"' + list[i]['9'] + '"';
			datas += ',0,0';
			datas += ',"' + list[i]['10'] + '"';
			datas += ',"' + list[i]['11'] + '"';
			datas += ',"' + list[i]['12'] + '"';
			datas += ',"' + list[i]['13'] + '"';
			datas += ',"' + list[i]['14'] + '"';
			datas += ',"' + list[i]['15'] + '"';
			datas += ',"' + list[i]['16'] + '"';
			datas += ',"' + list[i]['17'] + '"';
			datas += ',"' + list[i]['18'] + '"';
			datas += ',"' + list[i]['19'] + '"';
			datas += ',"' + list[i]['20'] + '"';
			datas += ',"' + list[i]['21'] + '"';
			datas += ',"' + list[i]['22'] + '"';
			datas += ',"' + list[i]['23'] + '"';
			datas += ',"' + list[i]['24'] + '"';
			datas += ',"' + list[i]['25'] + '"';
			datas += ',"' + list[i]['26'] + '"';
			datas += ',"' + list[i]['27'] + '"';
			datas += ',"' + list[i]['28'] + '"';
			datas += ',"' + list[i]['29'] + '"';
			datas += ',"' + list[i]['30'] + '"';
			datas += ',"' + list[i]['31'] + '"';
			datas += ',"' + list[i]['32'] + '"';
			datas += ',"' + list[i]['33'] + '"';
			datas += ',"' + list[i]['34'] + '"';
			datas += ',0,0';
			datas += ',"' + list[i]['35'] + '"';
			datas += ',"' + list[i]['36'] + '"';
			datas += ',"' + list[i]['37'] + '"';
			datas += ',"' + list[i]['38'] + '"';
			datas += ',"' + list[i]['39'] + '"';
			datas += ',"' + list[i]['40'] + '"';
			datas += ',"' + list[i]['41'] + '"';
			datas += ',"' + list[i]['42'] + '"';
			datas += ',"' + list[i]['43'] + '"';
			datas += ',"' + list[i]['44'] + '"';
			datas += ',"' + list[i]['45'] + '"';
			datas += ',0';
			datas += ',"' + list[i]['46'] + '"';
			datas += ',"' + list[i]['47'] + '"';
			datas += ',"' + list[i]['48'] + '"';
			datas += ',"' + list[i]['49'] + '"';
			datas += ',"' + list[i]['50'] + '"';
			datas += ',"' + list[i]['51'] + '"';
			datas += ',"' + list[i]['52'] + '"';
			datas += ',0,0,0,0,0,0,0,0,0';
			datas += ',"' + list[i]['53'] + '"';
			datas += ',0,0,0,0,0,0,0,0,0,0';
			datas += ',0,0,0,0,0,0';
			datas += ',"' + Ems103ViewModel.escapeJSON( list[i]['54'] ) + '"';
			datas += ',"' + Ems103ViewModel.escapeJSON( list[i]['55'] ) + '"';
			datas += ',"' + Ems103ViewModel.escapeJSON( list[i]['56'] ) + '"';
			datas += ',"' + list[i]['57'] + '"';

			datas += '\r\n';
		}
		var content = title + '\r\n' + datas;

		//var blob = new Blob([ content ], { "type" : "text/csv" });
		var blob = Utf2Sjis.convert(content);

		//
		//ネット出願から取得したデータを入試管理にアップロードする
		//



		//リクエストパラメータをセット
		var fd = new FormData();
		fd.append('nendo', cmncode.getNendo());
		fd.append('csv_file', blob);
		fd.append('upd_flg', '1');  //常に出願データは上書きする


		$.ajax({
			url:stngcode.ajax.webImpUrl,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: fd,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', data.syori + stngcode.msg.ems103end);

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
     * コードから名称変換
	 *
     */
	Ems103ViewModel.getGakubuName = function(code)
	{
		var ret = '';

		if (code) {
			ret = cd.gakubunm_cd[ code ]
		}

		return ret;
	};
	Ems103ViewModel.getSikenName = function(code)
	{
		var ret = '';

		if (code) {
			ret = cd.sikennm_cd[ code ]
		}

		return ret;
	};
	Ems103ViewModel.getGakkaName = function(code)
	{
		var ret = '';

		if (code) {
			ret = cd.gakkanm_cd[ code ]
		}

		return ret;
	};
	/**
	 *
     * CSVにセットできるようにJSON文字列をエスケープ
	 *
     */
	Ems103ViewModel.escapeJSON = function(obj)
	{
		if (obj) {
			var str = JSON.stringify(obj);
			str = str.replace(/,/g, '，');
			str = str.replace(/"/g, '’');
		} else {
			str = '';
		}
		return str;
	};
})();
