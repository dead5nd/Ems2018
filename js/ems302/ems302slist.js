/**
* @fileOverview 成績入力一覧クラス
* @author FiT
* @version 1.0.0
*
* 2017/5/11 センター試験の場合、マークシートと筆記を入れ替える
*
*/

(function()
{
	/**
	 *
	 * コンストラクタ
	 *
	 */
	Slist = function()
	{
	};

	/**
	 *
     * 一覧データの初期設定
	 *
     */
	Slist.init = function(list)
	{
		if (Ems302ViewModel.inpType == 'kaitoyosi') {
			Slist.data = {};
			Slist.data['th_list'] = [];
			for (var i = 0; i < list[0]['q_list'].length; i++) {
				Slist.data['th_list'][i] = {};
				Slist.data['th_list'][i]['setumon_no'] = list[0]['q_list'][i]['setumon_no'];
				Slist.data['th_list'][i]['setumon_nm'] = list[0]['q_list'][i]['setumon_nm'];
			}

			//マークシートデータなければ表示しない
			if (list[0]['ms_score'] != '') {
				Slist.data['ms_kubun'] = '2';
			} else {
				Slist.data['ms_kubun'] = '0';
			}

			Slist.data['tr_list'] = [];
			for (var i = 0; i < list.length; i++) {
				Slist.data['tr_list'][i] = {};

				Slist.data['tr_list'][i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
				Slist.data['tr_list'][i]['simei'] = list[i]['simei'];
				Slist.data['tr_list'][i]['ms_score'] = cmncode.floatToInt(list[i]['ms_score']);
				Slist.data['tr_list'][i]['ketu'] = list[i]['ketu'];
				Slist.data['tr_list'][i]['kekkaku_cd'] = list[i]['kekkaku_cd'] == '0' ? '' : list[i]['kekkaku_cd'];
				Slist.data['tr_list'][i]['gakka_cd'] = list[i]['gakka_cd'];
				Slist.data['tr_list'][i]['q_list'] = cmncode.scoreToInt( list[i]['q_list'] );
				//理科選択科目情報
				Slist.data['tr_list'][i]['buturi_ari'] = list[i]['buturi_ari'];
				Slist.data['tr_list'][i]['kagaku_ari'] = list[i]['kagaku_ari'];
				Slist.data['tr_list'][i]['seibutu_ari'] = list[i]['seibutu_ari'];


				//管理用
				Slist.data['tr_list'][i]['seq'] = i;
				Slist.data['tr_list'][i]['upd'] = '0';
			}
		} else if (Ems302ViewModel.inpType == 'kamokuitiran') {
			Slist.data = {};
			Slist.data['ms_kubun'] = '0';
			Slist.data['th_list'] = [];
			for (var i = 0; i < list[0]['k_list'].length; i++) {
				Slist.data['th_list'][i] = {};
				Slist.data['th_list'][i]['kamoku_cd'] = list[0]['k_list'][i]['kamoku_cd'];
				Slist.data['th_list'][i]['kamoku_nm_s'] = list[0]['k_list'][i]['kamoku_nm_s'];
				Slist.data['th_list'][i]['ms_kubun'] = list[0]['k_list'][i]['ms_kubun'];
				if (list[0]['k_list'][i]['ms_kubun'] == '1') {
					Slist.data['ms_kubun'] = '1';
				}

			}

			Slist.data['tr_list'] = [];
			var j = 0;
			var kekkaku_cd;

			for (var i = 0; i < list.length; i++) {
				kekkaku_cd = list[i]['kekkaku_cd'] == '' ? '0' : list[i]['kekkaku_cd'];
				if ( ($("#ketu_flg").prop('checked') ) && (list[i]['ketu']  == '1') ) {
					//表示しない
				} else if ( ($("#ketu_flg").prop('checked') ) && (kekkaku_cd != '0') )  {
					//表示しない
				} else {
					Slist.data['tr_list'][j] = {};
					Slist.data['tr_list'][j]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
					Slist.data['tr_list'][j]['simei'] = list[i]['simei'];
					//<<2017/5/14 全科目一覧は合否状態コードを参照するように変更したので1だけ抽出する
					Slist.data['tr_list'][j]['ketu'] = list[i]['ketu'] == '1' ? '1' : '';
					//>>
					Slist.data['tr_list'][j]['kekkaku_cd'] = list[i]['kekkaku_cd'] == '0' ? '' : list[i]['kekkaku_cd'];
					Slist.data['tr_list'][j]['gakka_cd'] = list[i]['gakka_cd'];

					//<<2017/5/11
					//センター試験の場合、マークシートを筆記の領域にセットする
					switch ($("#siken_cd").val()) {
					case '4':
					case '5':
						list[i]['k_list'] = cmncode.changeScore( list[i]['k_list'] );
						break;
					}
					//>>
					Slist.data['tr_list'][j]['k_list'] = cmncode.scoreToInt( list[i]['k_list'] );
					//管理用
					Slist.data['tr_list'][j]['seq'] = j;
					Slist.data['tr_list'][j]['upd'] = '0';

					//理科選択科目情報
					Slist.data['tr_list'][j]['buturi_ari'] = list[i]['buturi_ari'];
					Slist.data['tr_list'][j]['kagaku_ari'] = list[i]['kagaku_ari'];
					Slist.data['tr_list'][j]['seibutu_ari'] = list[i]['seibutu_ari'];
					j++;
				}

			}
		} else  {
			Slist.data = {};
			Slist.data['tr_list'] = [];
			for (var i = 0; i < list.length; i++) {
				Slist.data['tr_list'][i] = {};
				Slist.data['tr_list'][i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
				Slist.data['tr_list'][i]['simei'] = list[i]['simei'];
				Slist.data['tr_list'][i]['comment'] = list[i]['comment'];
				Slist.data['tr_list'][i]['ketu'] = list[i]['ketu'];
				Slist.data['tr_list'][i]['kekkaku_cd'] = list[i]['kekkaku_cd'] == '0' ? '' : list[i]['kekkaku_cd'];
				Slist.data['tr_list'][i]['gakka_cd'] = list[i]['gakka_cd'];
				Slist.data['tr_list'][i]['kamoku_cd'] = $("#kamoku_cd").val();
				Slist.data['tr_list'][i]['hyoka_score'] = list[i]['hyoka_score'];
				//管理用
				Slist.data['tr_list'][i]['seq'] = i;
				Slist.data['tr_list'][i]['upd'] = '0';
			}
		}

	};
	/**
	 *
	* 一覧データの初期設定(センタープラス向け)
	 *
     */
	Slist.initPlus = function(list)
	{

		Slist.data = {};
		Slist.data['ms_kubun'] = '0';
		Slist.data['th_list'] = [];
		Slist.data['th_list'][0] = {};
		Slist.data['th_list'][0]['kamoku_cd'] = 'P1';
		Slist.data['th_list'][0]['kamoku_nm_s'] = '一般前L1';
		Slist.data['th_list'][0]['ms_kubun'] = '0';

		Slist.data['th_list'][1] = {};
		Slist.data['th_list'][1]['kamoku_cd'] = 'P2';
		Slist.data['th_list'][1]['kamoku_nm_s'] = '一般前L2';
		Slist.data['th_list'][1]['ms_kubun'] = '0';

		Slist.data['th_list'][2] = {};
		Slist.data['th_list'][2]['kamoku_cd'] = 'P3';
		Slist.data['th_list'][2]['kamoku_nm_s'] = 'C前L1';
		Slist.data['th_list'][2]['ms_kubun'] = '0';

		Slist.data['th_list'][3] = {};
		Slist.data['th_list'][3]['kamoku_cd'] = 'P4';
		Slist.data['th_list'][3]['kamoku_nm_s'] = 'C前L2';
		Slist.data['th_list'][3]['ms_kubun'] = '0';



		Slist.data['tr_list'] = [];
		var j = 0;
		var kekkaku_cd;

		for (var i = 0; i < list.length; i++) {
			if ( list[i]['gakka_cd'] == $("#gakka_cd").val() ) {
				kekkaku_cd = list[i]['kekkaku_cd'] == '0';
				Slist.data['tr_list'][j] = {};
				Slist.data['tr_list'][j]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
				Slist.data['tr_list'][j]['simei'] = list[i]['simei'];
				Slist.data['tr_list'][j]['ketu'] = '';
				Slist.data['tr_list'][j]['kekkaku_cd'] = '';
				Slist.data['tr_list'][j]['gakka_cd'] = list[i]['gakka_cd'];

				Slist.data['tr_list'][j]['k_list'] = [];
				Slist.data['tr_list'][j]['k_list'][0] = {};
				Slist.data['tr_list'][j]['k_list'][0]['kamoku_cd'] = 'P1';
				Slist.data['tr_list'][j]['k_list'][0]['ms_kubun'] = '0';
				Slist.data['tr_list'][j]['k_list'][0]['kamoku_nm_s'] = '一般前L1';
				Slist.data['tr_list'][j]['k_list'][0]['ms_score'] = '';

				Slist.data['tr_list'][j]['k_list'][1] = {};
				Slist.data['tr_list'][j]['k_list'][1]['kamoku_cd'] = 'P2';
				Slist.data['tr_list'][j]['k_list'][1]['ms_kubun'] = '0';
				Slist.data['tr_list'][j]['k_list'][1]['kamoku_nm_s'] = '一般前L2';
				Slist.data['tr_list'][j]['k_list'][1]['ms_score'] = '';

				Slist.data['tr_list'][j]['k_list'][2] = {};
				Slist.data['tr_list'][j]['k_list'][2]['kamoku_cd'] = 'P3';
				Slist.data['tr_list'][j]['k_list'][2]['ms_kubun'] = '0';
				Slist.data['tr_list'][j]['k_list'][2]['kamoku_nm_s'] = 'C前L1';
				Slist.data['tr_list'][j]['k_list'][2]['ms_score'] = '';

				Slist.data['tr_list'][j]['k_list'][3] = {};
				Slist.data['tr_list'][j]['k_list'][3]['kamoku_cd'] = 'P4';
				Slist.data['tr_list'][j]['k_list'][3]['ms_kubun'] = '0';
				Slist.data['tr_list'][j]['k_list'][3]['kamoku_nm_s'] = 'C前L2';
				Slist.data['tr_list'][j]['k_list'][3]['ms_score'] = '';

				//
				//高成績の抽出
				//
				var scoreArry = [];
				//一般入試高成績の抽出
				if ('k_list_ipan' in list[i]) {
					for (var k = 0; k < list[i]['k_list_ipan'].length; k++) {
						scoreArry[k] = Number( cmncode.floatToInt(list[i]['k_list_ipan'][k]['score']) );
					}
					scoreArry.sort(function(a,b){
				        if( a > b ) return -1;
				        if( a < b ) return 1;
				        return 0;
					});
					Slist.data['tr_list'][j]['k_list'][0]['score'] = scoreArry[0];
					Slist.data['tr_list'][j]['k_list'][1]['score'] = scoreArry[1];
				} else {
					Slist.data['tr_list'][j]['k_list'][0]['score'] = 0;
					Slist.data['tr_list'][j]['k_list'][1]['score'] = 0;
				}
				//センター高成績の抽出
				var scoreArry = [];
				var n = 0;
				var J1K1 = 0;
				var F123 = 0; //基礎合計
				var kamoku_cd;
				if ('k_list_center' in list[i]) {
					for (var k = 0; k < list[i]['k_list_center'].length; k++) {
						kamoku_cd = list[i]['k_list_center'][k]['kamoku_cd'];
						//外国語はリスニング分と合算する
						if ((kamoku_cd == 'J1') || (kamoku_cd == 'K1')) {
							J1K1 = J1K1 + Number( cmncode.floatToInt(list[i]['k_list_center'][k]['score']) );
						//理科基礎科目の合計を１つの科目として算出する
						} else if ((kamoku_cd == 'F1') || (kamoku_cd == 'F2') || (kamoku_cd == 'F3')) {
							F123 = F123 + Number( cmncode.floatToInt(list[i]['k_list_center'][k]['score']) );
						} else if (kamoku_cd == 'A2'){
							//国語は看護、リハ、医経のみ利用可能
							switch (list[i]['gakka_cd']) {
								case '2':
								case '4':
								case '5':
								case '7':
									scoreArry.push( Number( cmncode.floatToInt(list[i]['k_list_center'][k]['score']) ) );
									break;

							}

						} else {
							scoreArry.push( Number( cmncode.floatToInt(list[i]['k_list_center'][k]['score']) ) );
						}

					}
					//外国語を100点換算する
					scoreArry.push( J1K1 * (100/250));

					//臨床検査学科以外は理科基礎科目を１つの科目として利用する
					//if (list[i]['gakka_cd'] != '1') {
						scoreArry.push( F123 );
					//}

					scoreArry.sort(function(a,b){
				        if( a > b ) return -1;
				        if( a < b ) return 1;
				        return 0;
					});
					Slist.data['tr_list'][j]['k_list'][2]['score'] = scoreArry[0];
					Slist.data['tr_list'][j]['k_list'][3]['score'] = scoreArry[1];
				} else {
					Slist.data['tr_list'][j]['k_list'][2]['score'] = 0;
					Slist.data['tr_list'][j]['k_list'][3]['score'] = 0;
				}

				//医療経営情報学科は上位1科目分だけを利用する
				if (list[i]['gakka_cd'] == '7') {
					Slist.data['tr_list'][j]['k_list'][1]['score'] = 0;
					Slist.data['tr_list'][j]['k_list'][3]['score'] = 0;
				}

				//管理用
				Slist.data['tr_list'][j]['seq'] = j;
				Slist.data['tr_list'][j]['upd'] = '1';
				j++;
			}
		}


	};

	/**
	 *
     * 一般入試
	 *
     */
	Slist.getTopScore = function()
	{


	};
	/**
	 *
     * 成績入力一覧初期表示
	 *
     */
	Slist.CBRBinit = function()
	{
		// 受付状況の値による設定
		var seq;
		var nameId;
		for (i=0; i < Slist.data.tr_list.length; i++) {
			seq = '#' + Slist.data.tr_list[i]['seq'];

			if (Slist.data.tr_list[i]['ketu'] == '1') {
				$(seq + '-ketu').prop('checked', true);
			}

			if (Ems302ViewModel.inpType == 'dankaihyoka') {
				nameId = Slist.data.tr_list[i]['seq']  + 'hyoka';
				$('[name=' + nameId +']').val([Slist.data.tr_list[i]['hyoka_score']]);
			}
			if (Ems302ViewModel.inpType == 'kamokuitiran') {
				for (var j = 0; j <Slist.data.tr_list[i]['k_list'].length; j++) {
					if (Slist.data.tr_list[i]['k_list'][j]['ms_kubun'] == '1') {
						//合計スコア更新
						var ms_score = Slist.data.tr_list[i]['k_list'][j]['ms_score'];
						var score = Slist.data.tr_list[i]['k_list'][j]['score'];
						var kamoku_cd = Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'];
						if (score != '') {
							$('#' + i + '-tscore-' + kamoku_cd).val( Number(ms_score) + Number(score) );
						}
					}
					//理科選択科目により入力欄の背景色を変える(医学部向け）
					if (Login.gakubuCd == '1') {
						var kamoku_cd = Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'];

						if ( (Slist.data.tr_list[i]['buturi_ari'] != '1') && (kamoku_cd == 'G1') ) {
							$('#' + i + '-score-' + kamoku_cd).addClass('cs-warning');
						}
						if ( (Slist.data.tr_list[i]['kagaku_ari'] != '1') && (kamoku_cd == 'G2') ) {
							$('#' + i + '-score-' + kamoku_cd).addClass('cs-warning');
						}
						if ( (Slist.data.tr_list[i]['seibutu_ari'] != '1') && (kamoku_cd == 'G3') ) {
							$('#' + i + '-score-' + kamoku_cd).addClass('cs-warning');
						}
					}
				}
			}

			if (Ems302ViewModel.inpType == 'kaitoyosi') {
				for (var j = 0; j <Slist.data.tr_list[i]['q_list'].length; j++) {
					//理科選択科目により入力欄の背景色を変える(医学部向け）
					if (Login.gakubuCd == '1') {
						var kamoku_cd = $("#kamoku_cd").val();
						var setumon_no = Slist.data.tr_list[i]['q_list'][j]['setumon_no'];

						if ( (Slist.data.tr_list[i]['buturi_ari'] != '1') && (kamoku_cd == 'G1') ) {
							$('#' + i + '-score-' + setumon_no).addClass('cs-warning');
						}
						if ( (Slist.data.tr_list[i]['kagaku_ari'] != '1') && (kamoku_cd == 'G2') ) {
							$('#' + i + '-score-' + setumon_no).addClass('cs-warning');
						}
						if ( (Slist.data.tr_list[i]['seibutu_ari'] != '1') && (kamoku_cd == 'G3') ) {
							$('#' + i + '-score-' + setumon_no).addClass('cs-warning');
						}
					}
				}
			}
			//
			// センタープラス、センター試験は入力欄無効にする
			//
			//<<2017/5/11
			if (Ems302ViewModel.inpType == 'kamokuitiran') {
				switch ($("#siken_cd").val()) {
					case '4':
					case '5':
						for (var j = 0; j <Slist.data.tr_list[i]['k_list'].length; j++) {
							var kamoku_cd = Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'];
							$('#' + i + '-score-' + kamoku_cd).prop('disabled', true);
						}
							//登録ボタンも無効にする
						$("#page01Commit").prop('disabled', true);
						break;

					case 'P':
						for (var j = 0; j <Slist.data.tr_list[i]['k_list'].length; j++) {
							var kamoku_cd = Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'];
							$('#' + i + '-score-' + kamoku_cd).prop('disabled', true);
						}
						break;

				}
			}
			//>>
		}
	};

	/**
	 *
     * テキストBOX入力時の処理
	 * @param 変更対象オブジェクト
     */
	Slist.editText = function(target)
	{
		var id = target.attr('id');
		// tr の idに行番号をセットしてあるのでその情報を取得
		var cur_tr = $(target).closest('tr')[0];
		var seq = cur_tr.id;

		//id名を-で分割して解析
		var ary = id.split('-');
		//-------------------
		//共通の入力チェック
		//-------------------
		var inputVal = $('#' + id).val();
		//空白は何もしない
		if (inputVal == '') {
			return;
		}
		//「D」は削除として処理
		if (inputVal == 'D') {
			inputVal = '';
		}
		//コメント以外全角は無効
		if (ary[1] != 'comment') {
			if (inputVal.match(/[^0-9.D]+/)) {
				$('#' + id).val('');
				return;
			}
		}

		if (ary[1] == 'kekkaku') {
			Slist.data.tr_list[seq]['kekkaku_cd'] = inputVal;
			Slist.data.tr_list[seq]['upd'] ='1';
		} else if (ary[1] == 'score') {
			if (Ems302ViewModel.inpType == 'kaitoyosi') {
				var setumon_no = ary[2];
				for (var i = 0; i < Slist.data.tr_list[seq]['q_list'].length; i++) {
					if (Slist.data.tr_list[seq]['q_list'][i]['setumon_no'] == setumon_no) {
						Slist.data.tr_list[seq]['q_list'][i]['score'] =inputVal;
						Slist.data.tr_list[seq]['upd'] ='1';

					}
				}

			} else {
				var kamoku_cd = ary[2];
				for (var i = 0; i < Slist.data.tr_list[seq]['k_list'].length; i++) {
					if (Slist.data.tr_list[seq]['k_list'][i]['kamoku_cd'] == kamoku_cd) {
						Slist.data.tr_list[seq]['k_list'][i]['score'] = inputVal;
						Slist.data.tr_list[seq]['upd'] ='1';
						if (Slist.data.tr_list[seq]['k_list'][i]['ms_kubun'] == '1') {
							//合計スコア更新
							var ms_score = Slist.data.tr_list[seq]['k_list'][i]['ms_score'];
							var score = Slist.data.tr_list[seq]['k_list'][i]['score'];
							$('#' + ary[0] + '-tscore-' + ary[2]).val( Number(ms_score) + Number(score) );
						}

					}
				}
			}

		} else if (ary[1] == 'comment') {
			Slist.data.tr_list[seq]['comment'] = inputVal;
			Slist.data.tr_list[seq]['upd'] ='1';


		}
	};
	/**
	 *
     * 欠席チェック入力時の処理
	 * @param 変更対象オブジェクト
     */
	Slist.editCheckBox = function(target)
	{
		var id = target.attr('id');
		// tr の idに行番号をセットしてあるのでその情報を取得
		var cur_tr = $(target).closest('tr')[0];
		var seq = cur_tr.id;

		//id名を-で分割して解析
		var ary = id.split('-');
		var kamoku_cd;
		if (ary[1] == 'ketu') {
			if ( $('#' + id).prop('checked')) {
				Slist.data.tr_list[seq]['ketu'] = '1';
				Slist.data.tr_list[seq]['upd'] ='1';
			} else {
				Slist.data.tr_list[seq]['ketu'] = '0';
				Slist.data.tr_list[seq]['upd'] ='1';
			}
		}
	};
	/**
	 *
     * 段階評価ラジオボタン入力時の処理
	 * @param 変更対象オブジェクト
     */
	Slist.editRadioBtn = function(target)
	{
		var nameId = target.attr('name');
		// tr の idに行番号をセットしてあるのでその情報を取得
		var cur_tr = $(target).closest('tr')[0];
		var seq = cur_tr.id;

		Slist.data.tr_list[seq]['hyoka_score'] = $('input[name="' + nameId + '"]:checked').val(); ;
		Slist.data.tr_list[seq]['upd'] ='1';

	};
	/**
	 *
     * 送信対象データを抽出しJSON形式で戻す
	 * @return 送信形式データ
     */
	Slist.sendData = function()
	{
		var seiseki_list = [];
		var j = 0;
		for (i=0; i < Slist.data.tr_list.length; i++) {
			if ( Slist.data.tr_list[i]['upd'] == '1' ) {
				seiseki_list[j] = {};
				seiseki_list[j]['juken_no'] = cmncode.jnoToFull( Slist.data.tr_list[i]['juken_no'] );
				seiseki_list[j]['ketu'] = Slist.data.tr_list[i]['ketu'];
				seiseki_list[j]['kekkaku_cd'] = Slist.data.tr_list[i]['kekkaku_cd'] == '' ? '0' : Slist.data.tr_list[i]['kekkaku_cd'];
				seiseki_list[j]['gakka_cd'] = Slist.data.tr_list[i]['gakka_cd'];
				if (Ems302ViewModel.inpType == 'kaitoyosi') {
					seiseki_list[j]['q_list'] = Slist.data.tr_list[i]['q_list'];
				} else if (Ems302ViewModel.inpType == 'kamokuitiran') {
					seiseki_list[j]['k_list'] = Slist.data.tr_list[i]['k_list'];
				} else {
					seiseki_list[j]['kamoku_cd'] = Slist.data.tr_list[i]['kamoku_cd'];
					seiseki_list[j]['hyoka_score'] = Slist.data.tr_list[i]['hyoka_score'];
					seiseki_list[j]['comment'] = Slist.data.tr_list[i]['comment'];
				}
				j++;
			}
		}
		return JSON.stringify(seiseki_list);
	};

})();
