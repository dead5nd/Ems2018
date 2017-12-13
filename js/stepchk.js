/** 
* @fileOverview 事務処理フェーズのチェック
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
	StepChk = function()
	{
	};
	
	
	/**
	 *
     * 現在の事務処理フェーズチェック
	 * @param siken_cd 試験区分コード
	 * @param gakka_cd 学科コード
	 * @param callback コールバック関数
	 * @return 進捗状況
	 *
     */
	StepChk.show = function(siken_cd, gakka_cd, callback)
	{

		StepChk.ret = {};
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = siken_cd;
		sendData['gakka_cd'] = gakka_cd;
		
		$.ajax({
			url: stngcode.ajax.stepChkUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('sinchoku_cd' in data) {
						StepChk.ret['cd'] = data.sinchoku_cd;
						StepChk.ret['name'] = cd.step[ Number(data.sinchoku_cd)-1 ]['name'];
						callback();
					} else {
						StepChk.ret['cd'] = '1';
						StepChk.ret['name'] = '受付';
						callback();
					}
					

				} else {
					StepChk.ret['cd'] = '9';
					StepChk.ret['name'] = data.err_msg;
					callback();
				}
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				StepChk.ret['cd'] = '9';
				StepChk.ret['name'] = XMLHttpRequest.statusText + XMLHttpRequest.status;
				callback();
			}
		});	
		
		
	};	
	
	/**
	 *
     * 指定事務処理フェーズの有無チェック
	 * @param gakka_cd 学科コード
	 * @param callback コールバック関数
	 * @return 有：true 無：false
	 *
     */
	StepChk.isThereStep = function(gakka_cd, step_cd, callback)
	{
		StepChk.ret = {};
		
		// 検索SQL文を組み立て
		var sql;
		var gakubu_cd = Login.gakubuCd;
		if (gakka_cd == '') {
			sql = "select count(*) from t_syori_sinchoku where gakubu_cd='" + gakubu_cd + "' and sinchoku_cd<>'" + step_cd + "'";
		} else {
			sql = "select count(*) from t_syori_sinchoku where gakubu_cd='" + gakubu_cd + "' and gakka_cd='" + gakka_cd + "' and sinchoku_cd<>'" + step_cd + "'";
		}
		// 送信情報を取得
		var sendData = {};	
		sendData['sql'] = sql;
		
		$.ajax({
			url: stngcode.ajax.cmnSrchUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						if (data.srch_list.length > 0) {
							var cnt = Number(data.srch_list[0]['c1']);
						} else {
							var cnt = 1;
						}
						if (cnt > 0) {
							StepChk.ret['cd'] = '0';
						} else {
							StepChk.ret['cd'] = step_cd;
						}
					} else {
						StepChk.ret['cd'] = '0';
					}
				} else {
					StepChk.ret['cd'] = '0';
				}
				callback();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				StepChk.ret['cd'] = '0';
				callback();
			}
		});	
		
	};		
	
})();
