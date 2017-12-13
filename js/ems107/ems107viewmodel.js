/** 
* @fileOverview Ems107画面表示・ビジネスロジック
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
	Ems107ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems107ViewModel.init = function()
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
	Ems107ViewModel.submit = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems107prog1);
		
		// 送信情報を取得
		var sql = "EXECUTE [db_owner].[SelectUketuke] N'gakubu_cd', N'siken_cd'";
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
						//受付情報を編集してインターネット出願へ連携する
						Ems107ViewModel.export(data.srch_list);
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
     * 入試管理から抽出した受付情報を編集してインターネット出願へ連携する
	 * 
	 * @parameter list1[] 送信対象情報リスト
     */
	Ems107ViewModel.export = function(list)
	{
		
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems107prog2);
		
		// 送信情報を取得
		var sendData = {};	
		var siken_list = [];
		for (var i=0; i < list.length; i++) {
			var obj = {};
			obj['torihiki_id'] = list[i]['c1'];
			obj['gakubu_cd'] = Login.gakubuCd;;
			//整理SEQは試験区分コード+学科コードで構成されている
			var str = list[i]['c2'];
			obj['siken_cd'] = str.substr(0,1);
			obj['gakka_cd'] = str.substr(1,1);
			obj['uketuke_stat'] = list[i]['c3'];
			//以下はここでは設定しない
			obj['juken_no'] = '';
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
						cmncode.dlg.alertMessageCB('確認', syori + stngcode.msg.ems107end, 
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
