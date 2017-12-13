/** 
* @fileOverview Ems108画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems108ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems108ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		// Data Picker初期化
		cmncode.datepickerInit(true);

	};	
	
	
	/**
	 *
     * Search処理
	 *
     */
	Ems108ViewModel.search = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems108prog1);
		
		// 送信情報を取得
		var sendData = {};	
		
		var sql = "SELECT s.torihiki_id, s.gakubu_cd, s.siken_cd, u.email, u.kanji_simei_sei, u.kanji_simei_mei, u.birthday, e.entry_ymd, e.kesai_type_nm, e.nyukin_kigen, e.nyukin_stat, e.nyukin_ymd, e.kesai_kingaku, e.torikesi_flg, u.password, e.mail_json FROM t_siken s INNER JOIN t_user u ON u.email = s.email INNER JOIN t_entry e ON e.torihiki_id = s.torihiki_id ";
		
		sql = sql + "WHERE s.gakubu_cd = '" + Login.gakubuCd + "'";
		//入力項目により条件を追加していく
		if ($("#siken_cd").val()) { sql = sql + " AND s.siken_cd='" + $("#siken_cd").val() + "'" ; }
		if ($("#gakka_cd").val()) { sql = sql + " AND s.gakka_cd='" + $("#gakka_cd").val() + "'"; }
		if ($("#seiri_no").val()) { sql = sql + " AND s.torihiki_id='" + $("#seiri_no").val() + "'"; }
		if ($("#email").val()) { sql = sql + " AND u.email='" + $("#email").val() + "'"; }
		if ($("#nyukin_stat").val()) { sql = sql + " AND e.nyukin_stat='" + $("#nyukin_stat").val() + "'"; }
		if ($("#kesai_type_cd").val()) { sql = sql + " AND e.kesai_type_cd='" + $("#kesai_type_cd").val() + "'"; }
		if ($("#kana_simei_sei").val()) { sql = sql + " AND u.kana_simei_sei like '%" + $("#kana_simei_sei").val() + "%'"; }
		if ($("#kana_simei_mei").val()) { sql = sql + " AND u.kana_simei_mei like '%" + $("#kana_simei_mei").val() + "%'"; }
		
		if ($("#entry_ymd_s").val()) { sql = sql + " AND e.entry_ymd >='" + $("#entry_ymd_s").val() + " 00:00:00'"; }
		if ($("#entry_ymd_e").val()) { sql = sql + " AND e.entry_ymd <='" + $("#entry_ymd_e").val() + " 23:59:59'"; }
		
		if ($("#nyukin_ymd_s").val()) { sql = sql + " AND e.nyukin_ymd >='" + $("#nyukin_ymd_s").val() + " 00:00:00'"; }
		if ($("#nyukin_ymd_e").val()) { sql = sql + " AND e.nyukin_ymd <='" + $("#nyukin_ymd_e").val() + " 23:59:59'"; }
		
		if ($("#torikesi_flg").val()) { sql = sql + " AND e.torikesi_flg <> '1'"; }
			
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
						//受信データの編集処理
						Ems108ViewModel.checkSrchResult(data.srch_list);
						
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Ems108ViewModel.result_list} , "table_Tmpl");
						// Data Tables初期化
						$('#page01Table').DataTable({
							searching: false,
							sort: true,
							fixedHeader: true,
							scrollX: true,
							scrollY: 530,
							displayLength: 50,
							columnDefs: [
								{ targets: 0,  width: 80 },
								{ targets: 1,  width: 100 },
								{ targets: 2,  width: 300 },
								{ targets: 3,  width: 150 },
								{ targets: 4,  width: 250 },
								{ targets: 5,  width: 80 },
								{ targets: 6,  width: 80 },
								{ targets: 7,  width: 130 },
								{ targets: 8,  width: 80 },
								{ targets: 9,  width: 80 },
								{ targets: 10, width: 80 },
								{ targets: 11, width: 100 },
								{ targets: 12, width: 50 }
							],
							language: {
								url: stngcode.dataTableJpnUrl
							} 
						});
									
						//cmncode.dataTablesInit(true,0);
						
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
     * 検索結果を一覧表示用に編集する
	 *
     */
	Ems108ViewModel.checkSrchResult = function(list)
	{
		var after_list = [];
		for (var i = 0; i < list.length; i++) {
			after_list[i] = {};
			after_list[i]['seiri_no'] = list[i]['1'];
			after_list[i]['gakubu'] = cd.gakubunm_cd[ list[i]['2'] ];
			after_list[i]['siken'] = cd.sikennm_cd[ Login.gakubuCd + list[i]['3'] ];
			after_list[i]['email'] = list[i]['4'];
			after_list[i]['kana'] = list[i]['5'] + ' ' + list[i]['6'];
			after_list[i]['birthday'] = list[i]['7'];
			after_list[i]['entry_ymd'] = cmncode.mdy2ymd( list[i]['8'] );
			after_list[i]['kesai_type_nm'] = list[i]['9'];
			after_list[i]['nyukin_kigen'] = cmncode.mdy2ymd( list[i]['10'] );
			after_list[i]['nyukin_stat_nm'] = cd.nyukinnm_cd[ list[i]['11'] ];
			after_list[i]['nyukin_ymd'] = cmncode.mdy2ymd( list[i]['12'] );
			after_list[i]['kesai_kingaku'] = cmncode.toComma( Number(list[i]['13']) );
			after_list[i]['torikesi_flg'] = list[i]['14'];
			after_list[i]['password'] = list[i]['15'];
			after_list[i]['mail_json'] =  JSON.stringify( list[i]['16'] ); //シリアライズして格納する
		}
		
		Ems108ViewModel.result_list = after_list;
	};
	
	/**
	 *
     * 検索結果CSV出力処理
	 *
     */
	Ems108ViewModel.export = function()
	{
	
		var content = '整理番号,学部,試験区分,メールアドレス,氏名,生年月日,出願日時,支払方法,支払期限,入金状況,入金日,金額,取消\n';
		for (var i = 0; i < Ems108ViewModel.result_list.length; i++) {
			content += '"'   + Ems108ViewModel.result_list[i]['seiri_no'];
			content += '","' + Ems108ViewModel.result_list[i]['gakubu'];
			content += '","' + Ems108ViewModel.result_list[i]['siken'];
			content += '","' + Ems108ViewModel.result_list[i]['email'];
			content += '","' + Ems108ViewModel.result_list[i]['kana'];
			content += '","' + Ems108ViewModel.result_list[i]['birthday'];
			content += '","' + Ems108ViewModel.result_list[i]['entry_ymd'];
			content += '","' + Ems108ViewModel.result_list[i]['kesai_type_nm'];
			content += '","' + Ems108ViewModel.result_list[i]['nyukin_kigen'];
			content += '","' + Ems108ViewModel.result_list[i]['nyukin_ymd'];
			content += '","' + Ems108ViewModel.result_list[i]['nyukin_stat_nm'];
			content += '","' + Ems108ViewModel.result_list[i]['kesai_kingaku'];
			content += '","' + Ems108ViewModel.result_list[i]['torikesi_flg'];
			content += '"\n';
		}
		//var blob = new Blob([ bom, content ], { "type" : "text/csv" });
		var blob = Utf2Sjis.convert(content);
		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, "netentry_export.csv"); 
		} else {
			document.getElementById("export").href = window.URL.createObjectURL(blob);
		}
		location.reload();
		
	};
	
	/**
	 *
     * 入金状況の変更
	 * @parameter nyukin_stat 変更入金状況ステータス
     */
	Ems108ViewModel.editNyukinStat = function( nyukin_stat )
	{
		var torihiki_id = Ems108ViewModel.torihiki_id;
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems108prog2);
		
		// 送信情報を取得
		var sendData = {};	
		
		var sql = "call update_nyukin_stat('torihiki_id','edit_stat');"

		sql = sql.replace('torihiki_id', torihiki_id);
		sql = sql.replace('edit_stat', nyukin_stat);
		
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
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					//更新された情報で再描画
					Ems108ViewModel.search();

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
	 * 通知メール送信 
	 * @parameter job 通知メールの種類
	 */
	Ems108ViewModel.sendMail = function(job)
	{
		//
		//送信メッセージの編集
		//
		var param = {};
		
		param = Ems108ViewModel.mailParam;
		//jobに応じてパラメータ変更
		switch (job) {
			case 'mypage':
				param['job'] = 'mypage';
				Ems108ViewModel.callGmail(param);
				break;
			
			case 'syutugan':
				if (param['mail_json'].length > 10) { //ある程度の長さがあるかで判断
					var obj = JSON.parse(param['mail_json']);
					Ems108ViewModel.callGmail(obj);
				}
				break;
			
			case 'nyukin':
				//入金済みの場合のみ
				if (param['nyukin_ymd']) {
					param['job'] = 'nyukin';
					Ems108ViewModel.callGmail(param);
				}
				break;
			
			case 'saisoku':
				//未入金の場合のみ
				if (!param['nyukin_ymd']) {
					param['job'] = 'saisoku';
					Ems108ViewModel.callGmail(param);
				}
				break;
			
		}
	};
	/**
	 *
	 * Gメール送信 
	 * @parameter param パラメータ
	 */
	Ems108ViewModel.callGmail = function(param)
	{
		var sendData = {};
		//
		//Gmail送信処理を呼び出しする
		//
		sendData['param'] = JSON.stringify( param );
		
		$.ajax({
			url: stngcode.ajax.sendMaillUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			timeout: stngcode.ajax.timeOut,
			success: function() {
				cmncode.dlg.alertMessage('確認', stngcode.msg.ems108end);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
			},
			complete: function() {
			}
		});	
		
	};
	
})();
