/** 
* @fileOverview Ems603画面表示・ビジネスロジック
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
	Ems603ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems603ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		
		//現在のフェーズリスト表示
		Ems603ViewModel.phaseList();
	};	
	
	/**
	 *
     * 実施前の整合性チェック
	 *
     */
	Ems603ViewModel.phaseCheck = function()
	{
		var naiyo = $("#naiyo").val();
		switch (naiyo) {
		case '1': // 受験番号確定
			if (StepChk.ret['cd'] == '1') {
				//現在のフェーズが「受付」ならOK
				Ems603ViewModel.phaseCommit();
			} else {
				cmncode.dlg.alertMessage('エラー', stngcode.msg.ems603error);
			}
			break;
			
		case '2': // 合否確定
			if ( (StepChk.ret['cd'] == '2') || (StepChk.ret['cd'] == '5') ){
				//現在のフェーズが「 受験番号確定」「1次合否確定」ならOK
				Ems603ViewModel.phaseCommit();
			} else {
				cmncode.dlg.alertMessage('エラー', stngcode.msg.ems603error);
			}
			break;
			
		case '3': // 入学者確定
			if (StepChk.ret['cd'] == '3') {
				//現在のフェーズが「 合否確定」ならOK
				Ems603ViewModel.phaseCommit();
			} else {
				cmncode.dlg.alertMessage('エラー', stngcode.msg.ems603error);
			}
			break;
			
		case '4': // 1次合否確定
			if (StepChk.ret['cd'] == '2') {
				//現在のフェーズが「 受験番号確定」ならOK
				Ems603ViewModel.phaseCommit();
			} else {
				cmncode.dlg.alertMessage('エラー', stngcode.msg.ems603error);
			}
			break;
		
		default:
			break;
			
		}
		
	};
	/**
	 *
     * 確定登録処理
	 *
     */
	Ems603ViewModel.phaseCommit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems603prog);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		
		var naiyo = $("#naiyo").val();
		if (naiyo == '1') { 		// 受験番号確定
			var urlStr = stngcode.ajax.jnoCmmtUrl;
		} else if (naiyo == '2') { 	// 合否確定
			sendData['sinchoku_cd'] = '3';
			sendData['pre_sinchoku_cd'] = '2';
			var urlStr = stngcode.ajax.jimuPhaseRegUrl;
		} else if (naiyo == '3') {	// 入学者確定
			sendData['sinchoku_cd'] = '4';
			sendData['pre_sinchoku_cd'] = '3';
			var urlStr = stngcode.ajax.jimuPhaseRegUrl;
		} else if (naiyo == '4') {	// 1次合否確定
			sendData['sinchoku_cd'] = '5';
			sendData['pre_sinchoku_cd'] = '2';
			var urlStr = stngcode.ajax.jimuPhaseRegUrl;
		}
	
		$.ajax({
			url: urlStr,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems603end1);

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
     * 前の状態に戻す処理
	 *
     */
	Ems603ViewModel.phaseCancel = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems603prog);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
	
		$.ajax({
			url:stngcode.ajax.phaseCanUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					cmncode.dlg.alertMessage('確認', stngcode.msg.ems603end2);

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
     * 現在の処理フェーズ一覧を表示する
	 * 2017/05/15
	 *
     */
	Ems603ViewModel.phaseList = function()
	{
		// 汎用データ検索インタフェースを利用する
		// 検索用SQLをセット
		var sendData = {};	
		var sql = "SELECT siken_nm, gakka_nm, k_nm FROM t_syori_sinchoku ";
		sql = sql + "INNER JOIN m_siken_kubun ON t_syori_sinchoku.gakubu_cd=m_siken_kubun.gakubu_cd ";
		sql = sql + "AND t_syori_sinchoku.siken_cd=m_siken_kubun.siken_cd ";
		sql = sql + "INNER JOIN m_gakka ON t_syori_sinchoku.gakka_cd=m_gakka.gakka_cd ";
		sql = sql + "INNER JOIN m_kubun_nm ON t_syori_sinchoku.sinchoku_cd=m_kubun_nm.k_cd ";
		sql = sql + "AND m_kubun_nm.s_cd='7' ";
		sql = sql + "WHERE t_syori_sinchoku.gakubu_cd='" +  Login.gakubuCd + "'";
		sql = sql + "ORDER BY t_syori_sinchoku.siken_cd, t_syori_sinchoku.gakka_cd";

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
						cmncode.template.bind("table_Script", {"rows": data.srch_list} , "table_Tmpl");

						$('#page01Table').DataTable({
							searching: false,
							sort: false,
							fixedHeader: true,
							scrollY: 400,
							displayLength: 100, 
							language: {
								url: stngcode.dataTableJpnUrl
							} 
						});
					} else {
						cmncode.template.bind("table_Script", {"rows": []} , "table_Tmpl");
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
	
	
})();
