/** 
* @fileOverview Ems504画面表示・ビジネスロジック
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
	Ems504ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems504ViewModel.init = function()
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
			
			Login.gakubuCd = ('gakubu_cd' in paramArray) ? paramArray['gakubu_cd'] : '';
			
			//URL直接アクセス時の対応
			/*
			if ('log' in paramArray) {
				var log = cmncode.decodeURI(paramArray['log']);
				var time_diff = Ems504ViewModel.getTimeDiff(log);
				if (time_diff > 5) { 
					window.location.href = stngcode.loginUrl;
				}
			} else {
				window.location.href = stngcode.loginUrl;
			}
			*/
			
		}
		
		//
		// 受験生詳細画面ボタンの情報設定
		//
		var obj = {};
		obj['seiri_no'] = ('seiri_no' in paramArray) ? paramArray['seiri_no'] : '';
		obj['gakka_cd'] = ('gakka_cd' in paramArray) ? paramArray['gakka_cd'] : '';
		obj['gakubu_cd'] = Login.gakubuCd;
		obj['log'] = ('log' in paramArray) ? paramArray['log'] : '';
		//パラメータが設定されている場合にボタン表示する
		if (obj['seiri_no'] !='') {
			cmncode.template.bind("button_Script", obj , "button_Tmpl");
		}
		
		//
		// 併願情報を取得する
		//
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems504prog);
		
		// 送信パラメータ設定
		var sendData = {};
		sendData['heigan_seq'] =('heigan_seq' in paramArray) ? paramArray['heigan_seq'] : '';

		$.ajax({
			url:stngcode.ajax.heiganUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						
						//受信データの編集と画面への表示
						Ems504ViewModel.checkSrchResult(data);
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
	Ems504ViewModel.checkSrchResult = function(data)
	{

		var heigan = [];
		var score1;
		var score2;
		for (var i = 0; i < data.srch_list.length; i++) {
			score1 = Number( data.srch_list[i]['1ji_score'] );
			score2 = Number( data.srch_list[i]['2ji_score'] );
			
			heigan[i] = {};
			heigan[i]['siken_nm'] = cd.sikenNm[data.srch_list[i]['siken_cd']];
			heigan[i]['gakka_nm'] = cd.gakkaNm[data.srch_list[i]['gakka_cd']];
			heigan[i]['mark'] = (data.srch_list[i]['mark'] == '1') ? '〇' : '';
			heigan[i]['juken_no'] = cmncode.jnoToShort( data.srch_list[i]['juken_no'] );
			heigan[i]['sogo_score'] = (score2 > score1) ? score2 : score1;
			heigan[i]['sogo_juni'] = data.srch_list[i]['sogo_juni'];
			heigan[i]['gohi_nm'] = cd.gohiNm[data.srch_list[i]['gohi_stat']];
			heigan[i]['hoketu_juni'] = data.srch_list[i]['hoketu_juni'];
			heigan[i]['nokin_nm'] = cd.nokinNm[data.srch_list[i]['nokin_stat']];
		}
		
		cmncode.template.bind("table_Script", {"rows": heigan} , "table_Tmpl");
		
	};
	
	
	/**
	 *
     * 現在日時との時間差(秒)取得
	 *
     */	
	Ems504ViewModel.getTimeDiff = function(date1Str)
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
