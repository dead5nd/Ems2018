/** 
* @fileOverview Ems502画面表示・ビジネスロジック
* @author FiT
* @version 1.0.0
*
* 2017/5/5 検索条件追加
*          不備＋未着/地域枠指定/2次試験希望日
*/

(function()
{
	/**
	 *
	 * コンストラクタ 
	 *
	 */
	Ems502ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems502ViewModel.init = function()
	{
		var code = Login.gakubuCd;
		cmncode.template.bind("siken_Script", {"rows": cd.siken[code]} , "siken_Tmpl");
		cmncode.template.bind("gakka_Script", {"rows": cd.gakka[code]} , "gakka_Tmpl");
		cmncode.template.bind("sikenti_Script", {"rows": cd.kaijo[code]} , "sikenti_Tmpl");
		cmncode.template.bind("uketuke_Script", {"rows": cd.uketuke} , "uketuke_Tmpl");
		cmncode.template.bind("gohi_Script", {"rows": cd.gohi} , "gohi_Tmpl");
		cmncode.template.bind("nokin_Script", {"rows": cd.nokin} , "nokin_Tmpl");
		
		//<<2017/5/5
		// Data Picker初期化
		cmncode.datepickerInit(true);
		//>>
	};	
	
	/**
	 *
     * 試験地選択欄の更新
	 *
     */
	Ems502ViewModel.sikentiSelect = function()
	{
		
		// 送信情報を取得
		var sendData = {};	
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		
		$.ajax({
			url:stngcode.ajax.getSikentiUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						cmncode.template.bind("sikenti_Script", {"rows": data.srch_list} , "sikenti_Tmpl");
					} else {
						cmncode.template.bind("sikenti_Script", {"rows": []} , "sikenti_Tmpl");
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
     * Search処理
	 *
     */
	Ems502ViewModel.search = function(form)
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems502prog1);
		
		// 送信情報を取得
		var sendData = {};	
		sendData['nendo'] = cmncode.getNendo();
		sendData['gakubu_cd'] = Login.gakubuCd;
		sendData['siken_cd'] = $("#siken_cd").val();
		sendData['gakka_cd'] = $("#gakka_cd").val();
		sendData['sikenti_cd'] = $("#sikenti_cd").val();
		
		sendData['uketuke_stat'] = $("#uketuke_stat").val();
		sendData['gohi_stat'] = $("#gohi_stat").val();
		sendData['nokin_stat'] = $("#nokin_stat").val();
		sendData['heigan_seq'] = $("#heigan_seq").val();
		
		var seiri_no11 = $("#seiri_no").val();
		sendData['seiri_no'] = seiri_no11.substr(0,9);
		if (seiri_no11.length > 9) {
			sendData['seiri_seq'] = seiri_no11.substr(9);
		} else {
			sendData['seiri_seq'] = '';
		}
		sendData['juken_no'] = cmncode.jnoToFull( $("#juken_no").val() );
		sendData['kanji_simei'] = $("#kanji_simei").val();
		sendData['kana_simei'] = $("#kana_simei").val();
		sendData['det_req'] = '0'; //詳細情報不要
		sendData['dai2_kubun'] = $("#dai2_kubun").val();
		
		//受験番号未発行を選択した場合に受付状況が「選択なし」なら書類OKを条件に追加する
		sendData['juken_stat'] = $("#juken_stat").val();
		if (sendData['juken_stat'] == '0') {
			if (sendData['uketuke_stat'] == '') {
				sendData['uketuke_stat'] = '1';
			}
		}
		//<<2017/5/5
		sendData['waku'] = $("#waku").val();
		sendData['sikenbi2'] = $("#sikenbi2").val();
		//>>
	
		$.ajax({
			url:stngcode.ajax.jgRefUrl,
			type: 'post',
			//contentType: false,
			timeout: stngcode.ajax.timeOut,
			data: sendData,
			dataType: 'json',
			success: function (data) {
				// サーバからのデータを解析して表示する
				if (data.stat == 'OK') {
					if ('srch_list' in data) {
						//受信データの編集処理
						Ems502ViewModel.checkSrchResult(data.srch_list);
						
						//jqueryTemplateで画面を作る
						cmncode.template.bind("table_Script", {"rows": Ems502ViewModel.result_list} , "table_Tmpl");
						// Data Tables初期化
						$('#page01Table').DataTable({
							lengthChange: false,
							searching: false,
							sort: true,
							fixedHeader: true,
							scrollY: 530,
							order:[[1,'asc']],
							displayLength: 3000, 
							columnDefs: [ {
						      targets: [0],
						      orderable: false
		   					 } ],
							language: {
								url: stngcode.dataTableJpnUrl
							} 
						});
						
						// 操作イベント設定
						Ems502ViewModel.setEvent();
						
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
     * 検索結果一覧の中で受験番号の桁数を学部仕様にする
	 *
     */
	Ems502ViewModel.checkSrchResult = function(list)
	{
		var json = sessionStorage.getItem('login');
		var after_list = [];
		for (var i = 0; i < list.length; i++) {
			after_list[i] = {};
			after_list[i]['seiri_no'] = list[i]['seiri_no'];
			after_list[i]['seiri_no_short'] = cmncode.seiriToShort( list[i]['seiri_no'] );
			after_list[i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			after_list[i]['simei'] = list[i]['simei'];
			after_list[i]['uketuke'] = list[i]['uketuke'];
			after_list[i]['gohi'] = list[i]['gohi'];
			after_list[i]['nokin'] = list[i]['nokin'];
			after_list[i]['heigan_seq'] = list[i]['heigan_seq'];
			after_list[i]['gakka_cd'] = list[i]['gakka_cd'];
			after_list[i]['gakubu_cd'] = Login.gakubuCd;
			after_list[i]['log'] = encodeURI(cmncode.getTime());
			after_list[i]['mail'] = list[i]['mail'];
			//管理用
			after_list[i]['seq'] = i;
		}
		
		Ems502ViewModel.result_list = after_list;
	};
	/**
	 *
     * 全選択、全解除ボタンのイベント
	 *
     */
	Ems502ViewModel.setEvent = function()
	{
		$("#checkAll").on('click', function() 
		{
			$('input[name="target"]').prop('checked', true);
		});
		
		$("#clearAll").on('click', function() 
		{
			$('input[name="target"]').prop('checked', false);
		});
	};	

	/**
	 *
     * 対象確定しメール入力画面表示
	 *
     */
	Ems502ViewModel.submit = function()
	{
		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems502prog2);
		
		var sendData = {};
		
		//テンプレート情報の取得
		$.ajax({
			url: stngcode.ajax.mailTmpUrl[Login.gakubuCd]['url'],
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					Ems502ViewModel.mailTmp = data;
					Ems502ViewModel.openDialog();
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
		
	Ems502ViewModel.openDialog = function()
	{		
		//アカウント選択肢の設定
		cmncode.template.bind("acc_Script", {"rows": Ems502ViewModel.mailTmp.acc_list} , "acc_Tmpl");
		Ems502ViewModel.mailUrl = Ems502ViewModel.mailTmp.acc_list[0]['mail_url']; //初期値
		
		//テンプレート選択肢の設定
		cmncode.template.bind("mail_Script", {"rows": Ems502ViewModel.mailTmp.srch_list} , "mail_Tmpl");
		
		//入力欄クリア
		$("#mailTitle").val('');
		$("#mailMessage").val('');
		
		//前回のイベント設定をキャンセル
		$("#mailInput").off('show.bs.modal');
		$("#mailInput").off('shown.bs.modal');
		
		$("#mailInput").on('show.bs.modal', function (event) {
				
			$("#mailSendOK").off('click'); 
			$("#mailSendOK").on('click', function (event)
			{
				$("#mailInput").modal('hide');
				//未入力のチェック
				if ($("#mailTitle").val() == '') {
					cmncode.dlg.alertMessageCB('エラー', stngcode.msg.ems502error1,
						function(){ $("#mailInput").modal(); });
				} else if ($("#mailMessage").val() == '') {
					cmncode.dlg.alertMessageCB('エラー', stngcode.msg.ems502error2,
						function(){ $("#mailInput").modal(); });
				} else {
					cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
					stngcode.msg.ems502conf ,  
					function() { 
						Ems502ViewModel.sendMail();
			    		return false;
					});	
				}
				
			});
			
		});
		//コメント入力のサイズをこのタイミングで調整する
		$("#mailInput").on('shown.bs.modal', function (event) {
			autosize($('textarea'));
		});
		
		//ひな形選択時の処理
		$("#mail_template").on('change', function () {
			var i = Number( $("#mail_template").val() ) -1 ;
			$("#mailTitle").val(Ems502ViewModel.mailTmp.srch_list[i]['title']);
			$("#mailMessage").val(Ems502ViewModel.mailTmp.srch_list[i]['message']);
			
		});
		
		//アカウント選択時の処理
		$("#acc_template").on('change', function () {
			var i = Number( $("#acc_template").val() ) -1 ;
			Ems502ViewModel.mailUrl = Ems502ViewModel.mailTmp.acc_list[i]['mail_url'];
			
		});
		
		$("#mailInput").modal();
		
	
	};			
	
	/**
	 *
     * 一斉メール情報登録処理
	 * 承認用の管理データを登録する
     */
	Ems502ViewModel.sendMail = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems502prog3);
		
		var list = [];
		var param = {};
		var sendData = {};
		var seq;
		var cnt = 0;
		//選択ONの受験生の整理番号を取得する
		var checkList = $('[name="target"]:checked').map(function(){
			return $(this).val();
		}).get();
		//選択ONの受験生分送信データを作成する
		Ems502ViewModel.sendlist = [];
		for (var i = 0; i < Ems502ViewModel.result_list.length; i++) {
			seq = '#c' + i;
			if ( $(seq).prop('checked') ) {
				Ems502ViewModel.sendlist[cnt] = {};
				Ems502ViewModel.sendlist[cnt]['mail'] = Ems502ViewModel.result_list[i]['mail'];
				Ems502ViewModel.sendlist[cnt]['seiri_no'] = Ems502ViewModel.result_list[i]['seiri_no_short'];
				Ems502ViewModel.sendlist[cnt]['juken_no'] = Ems502ViewModel.result_list[i]['juken_no'];
				Ems502ViewModel.sendlist[cnt]['simei'] = Ems502ViewModel.result_list[i]['simei'];
				cnt++;
			}
		}
		Ems502ViewModel.sendcnt = cnt; 	//送信件数
		Ems502ViewModel.sended = 0; 	//送信済み件数
		
		param['title'] = $("#mailTitle").val();
		param['message'] = $("#mailMessage").val();
		param['tmp_nm'] = $("#mail_template option:selected").text();
		param['count'] = cnt;
		
		sendData['param'] = JSON.stringify(param);
		sendData['phase'] = 'first';
		
	
		$.ajax({
			//url: stngcode.ajax.mailRegUrl[Login.gakubuCd]['url'],
			url: Ems502ViewModel.mailUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					Ems502ViewModel.sendMailId = data.id;
					Ems502ViewModel.sendMailDataCall();
				} else {
					cmncode.dlg.hideLoading();
					cmncode.dlg.alertMessage('エラー', data.err_msg);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.hideLoading();
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
			},
			complete: function() {
				
			}
		});

	};
	
	/**
	 *
     * 一斉メール情報登録処理呼び出し用
	 *
     */
	Ems502ViewModel.sendMailDataCall = function()
	{
		Ems502ViewModel.sendMailData();
	};
	/**
	 *
     * 一斉メール情報登録処理
	 * 受験生別の情報を登録する
	 *
     */
	Ems502ViewModel.sendMailData = function()
	{

		
		var list = [];
		var sendData = {};
		var seq;
		var cnt = 0;
		
		for (var i = 0; i < stngcode.ajax.sendMax; i++) {
			if ( Ems502ViewModel.sended < Ems502ViewModel.sendcnt ) {
				cnt = Ems502ViewModel.sended;
				list[i] = {};
				list[i]['mail'] = Ems502ViewModel.sendlist[cnt]['mail'];
				list[i]['seiri_no'] = Ems502ViewModel.sendlist[cnt]['seiri_no'];
				list[i]['juken_no'] = Ems502ViewModel.sendlist[cnt]['juken_no'];
				list[i]['simei'] = Ems502ViewModel.sendlist[cnt]['simei'];
				Ems502ViewModel.sended++;
			}
		}
		
		sendData['id'] = Ems502ViewModel.sendMailId;
		sendData['phase'] = 'second';
		sendData['send_list'] = JSON.stringify(list);
		
	
		$.ajax({
			//url: stngcode.ajax.mailRegUrl[Login.gakubuCd]['url'],
			url: Ems502ViewModel.mailUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					if ( Ems502ViewModel.sended < Ems502ViewModel.sendcnt ) {
						Ems502ViewModel.sendMailDataCall();
					} else {
						cmncode.dlg.hideLoading();
						cmncode.dlg.alertMessage('確認', stngcode.msg.ems502end);
					}
				} else {
					cmncode.dlg.hideLoading();
					cmncode.dlg.alertMessage('エラー', data.err_msg);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.hideLoading();
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
				
			},
			complete: function() {
				
			}
		});

	};
	/**
	 * 2017/6/13 
     * テンプレート更新処理
	 *
     */
	Ems502ViewModel.updateTemplate = function()
	{

		// 送信中のメッセージ表示
		cmncode.dlg.showLoading(stngcode.msg.ems502prog4);
		
		var list = [];
		var param = {};
		var sendData = {};
		var seq;
		var cnt = 0;

		sendData['id'] = $("#mail_template").val();
		sendData['title'] = $("#mailTitle").val();
		sendData['message'] = $("#mailMessage").val();
	
		$.ajax({
			url: stngcode.ajax.mailTmpUpdateUrl[Login.gakubuCd]['url'],
			type: 'GET',
			dataType: 'jsonp',
			data: sendData,
			contentType: false,
			cache : false,
			timeout: stngcode.ajax.timeOut,
			success: function(data) {
				if (data.stat == 'OK') {
					//何もしない
				} else {
					cmncode.dlg.hideLoading();
					cmncode.dlg.alertMessage('エラー', data.err_msg);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				cmncode.dlg.hideLoading();
				cmncode.dlg.alertMessage('エラー', XMLHttpRequest.statusText + XMLHttpRequest.status);
			},
			complete: function() {
				cmncode.dlg.hideLoading();
			}
		});

	};
})();
