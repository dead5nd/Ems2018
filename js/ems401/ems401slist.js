/**
* @fileOverview 成績入力一覧クラス
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
		var before_juni = 0;
		var juni;
		var selectId;
		Slist.data = {};
		Slist.data['srch_list'] = [];

		Slist.base_gokaku ='';
		Slist.base_tokutai ='';
		Slist.base_seiki ='';
		Slist.base_hoketu ='';

		for (var i = 0; i < list.length; i++) {
			list[i]['total_score'] = cmncode.floatToInt( list[i]['total_score'] );
			Slist.data['srch_list'][i] = list[i];
			Slist.data['srch_list'][i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			Slist.data['srch_list'][i]['hugokaku_cd'] = '';
			Slist.data['srch_list'][i]['hantei_syudan_cd'] = '';
			Slist.data['srch_list'][i]['upd'] = '0';

			//合否備考から前回の基準値を取得する
			if (list[i]['biko_gohi'].indexOf('$JSON$') !== -1) {
				var ary = list[i]['biko_gohi'].split('$JSON$');
				var obj = JSON.parse(ary[1]);
				if ('base_gokaku' in obj) { Slist.base_gokaku =  obj['base_gokaku'] };
				if ('base_tokutai' in obj) { Slist.base_tokutai =  obj['base_tokutai'] };
				if ('base_seiki' in obj) { Slist.base_seiki =  obj['base_seiki'] };
				if ('base_hoketu' in obj) { Slist.base_hoketu =  obj['base_hoketu'] };

				//合否備考を2つに分けて管理する
				Slist.data['srch_list'][i]['biko_gohi'] = ary[0];
				Slist.data['srch_list'][i]['biko_json'] = '$JSON$' + ary[1];
			} else {
				Slist.data['srch_list'][i]['biko_json'] = '';
			}

			//管理用
			Slist.data['srch_list'][i]['seq'] = i;

			//欠格区分の文言設定
			Slist.data['srch_list'][i]['kekkaku'] = cd.kekkaku[ list[i]['kekkaku_cd'] ];

			//入力タイプの判定
			if (Login.gakubuCd == '1') { //医学部
				if ($("#12ji_kubun").val() == '1') {
					Slist.entryType = '1';
				} else {
					Slist.entryType = '2';
				}
			} else if ( (Login.gakubuCd == '2') && ($("#siken_cd").val() == 'A') ){ //アセンブリ
				if ($("#12ji_kubun").val() == '1') {
					Slist.entryType = '1';
				} else {
					Slist.entryType = '2';
				}
			} else {
				Slist.entryType = '2';
			}

		}

	};
	/**
	 *
     * 一覧表示の初期処理
	 *
	 * @return 2次合否との整合性チェック
	 *
     */
	Slist.initList = function()
	{
		var before_juni = 0;
		var juni;
		var ret = false;
		var kekkaku_cd;

		for (var i = 0; i < Slist.data.srch_list.length; i++) {
			//同順の背景色設定
			juni = Number( Slist.data.srch_list[i]['juni'] );
			if ( juni == before_juni) {
				$('#' + i).css('background-color',  stngcode.UKETUKE['INI']['bgcolor']);
				$('#' + (i-1)).css('background-color',  stngcode.UKETUKE['INI']['bgcolor']);
			}
			before_juni = juni;

			//合否選択欄の初期設定
			selectId = '#' + i + '-gohi';
			$(selectId).val(Slist.data.srch_list[i]['gohi_stat']);

			//欠格の場合は合否は不合格で表示し、登録されるようにする
			kekkaku_cd = Slist.data.srch_list[i]['kekkaku_cd'] == '' ? '0' : Slist.data.srch_list[i]['kekkaku_cd'];
			if (kekkaku_cd != '0') {
				$(selectId).val('2');
				$(selectId).prop('disabled', true);
				Slist.data.srch_list[i]['hugokaku_cd'] = (Slist.entryType == '1') ? '2' : '3'; //不合格詳細
				Slist.data.srch_list[i]['upd'] = '1';
			}

			//1次合否実施が選択されて、2次合否実施済みかチェック
			/*
			switch (Slist.data.srch_list[i]['gohi_stat']) {
				case '4':
				case '5':
				case '6':
					if ($("#12ji_kubun").val() == '1') {
						ret = true;
					}
					break;
				default:
					break;
			}
			*/
		}
		//前回基準値を表示する
		if (Slist.entryType == '1') {
			$("#base_gokaku").val(Slist.base_gokaku);
		} else {
			$("#base_tokutai").val(Slist.base_tokutai);
			$("#base_seiki").val(Slist.base_seiki);
			$("#base_hoketu").val(Slist.base_hoketu);
		}

		//各状態の集計を表示する
		Slist.sumGohi();

		return ret;

	};
	/**
	 *
	* 合否判定の一括設定処理(分岐)
	 *
     */
	Slist.autoSet = function()
	{
		if (Slist.entryType == '1') {
			Slist.autoSet1ji();
		} else {
			Slist.autoSet2ji();
		}

	}
	/**
	 *
     * 合否判定の一括設定処理(一次試験)
	 *
     */
	Slist.autoSet1ji = function()
	{
		var GOKAKU     = '3';
		var HU_GOKAKU  = '2';

		var base_gokaku = $("#base_gokaku").val() != '' ? Number( $("#base_gokaku").val() ) : 9999 ;

		var gokaku_cnt = 0;
		var hu_gokaku_cnt = 0;

		var total_score;
		var selectId;
		var kekkaku_cd;

		//合否選択変更のイベントを解除
		Slist.setChangeEvent('off');

		//基準値をもとに合否を自動セット
		for (i=0; i < Slist.data.srch_list.length; i++) {
			total_score = Number( Slist.data.srch_list[i]['total_score'] );
			Slist.data.srch_list[i]['biko_json'] = '';

			kekkaku_cd = Slist.data.srch_list[i]['kekkaku_cd'] == '' ? '0' : Slist.data.srch_list[i]['kekkaku_cd'];
			if (kekkaku_cd == '0') { //欠格の場合は自動判定の対象としない
				if (total_score >= base_gokaku) {
					selectId = '#' + i + '-gohi';
					$(selectId).val(GOKAKU);
					gokaku_cnt++;
				} else {
					selectId = '#' + i + '-gohi';
					$(selectId).val(HU_GOKAKU);
					hu_gokaku_cnt++;
					Slist.data.srch_list[i]['hugokaku_cd'] = '2'; //一次不合格
					//基準値を格納
					var obj = {};
					obj['base_gokaku'] = $("#base_gokaku").val();
					Slist.data.srch_list[i]['biko_json'] = '$JSON$' + JSON.stringify(obj);
				}
			} else {
				//基準値を格納
				var obj = {};
				obj['base_gokaku'] = $("#base_gokaku").val();
				Slist.data.srch_list[i]['biko_json'] = '$JSON$' + JSON.stringify(obj);
			}
			Slist.data.srch_list[i]['hantei_syudan_cd'] = '1'; //合否自動設定
			Slist.data['srch_list'][i]['upd'] = '1';
		}

		//各状態の集計を表示する
		$("#sum_gokaku").text(gokaku_cnt);
		$("#sum_hu_gokaku").text(hu_gokaku_cnt);

		//合否選択変更のイベントを設定
		Slist.setChangeEvent('on');
	};

	/**
	 *
	* 合否判定の一括設定処理(二次試験)
	 *
     */
	Slist.autoSet2ji = function()
	{
		var TOKUTAI    = '5';
		var SEIKI      = '6';
		var HOKETU     = '4';
		var HU_GOKAKU  = '2';

		var base_tokutai = $("#base_tokutai").val() != '' ? Number( $("#base_tokutai").val() ) : 9999 ;
		var base_seiki   = $("#base_seiki").val() != '' ? Number( $("#base_seiki").val() ) : 9999 ;
		var base_hoketu  = $("#base_hoketu").val() != '' ? Number( $("#base_hoketu").val() ) : 9999 ;

		var tokutai_cnt = 0;
		var seiki_cnt = 0;
		var hoketu_cnt = 0;
		var hu_gokaku_cnt = 0;

		var total_score;
		var selectId;
		var kekkaku_cd;

		//合否選択変更のイベントを解除
		Slist.setChangeEvent('off');

		//基準値をもとに合否を自動セット
		for (i=0; i < Slist.data.srch_list.length; i++) {
			total_score = Number( Slist.data.srch_list[i]['total_score'] );
			Slist.data.srch_list[i]['biko_json'] = '';

			kekkaku_cd = Slist.data.srch_list[i]['kekkaku_cd'] == '' ? '0' : Slist.data.srch_list[i]['kekkaku_cd'];
			if (kekkaku_cd == '0') { //欠格の場合は自動判定の対象としない
				if (total_score >= base_tokutai) {
					selectId = '#' + i + '-gohi';
					$(selectId).val(TOKUTAI);
					tokutai_cnt++;

				} else if (total_score >= base_seiki) {
					selectId = '#' + i + '-gohi';
					$(selectId).val(SEIKI);
					seiki_cnt++;

				} else if (total_score >= base_hoketu) {
					selectId = '#' + i + '-gohi';
					$(selectId).val(HOKETU);
					hoketu_cnt++;

				} else {
					selectId = '#' + i + '-gohi';
					$(selectId).val(HU_GOKAKU);
					hu_gokaku_cnt++;
					Slist.data.srch_list[i]['hugokaku_cd'] = '3'; //二次不合格
					//基準値を格納
					var obj = {};
					obj['base_tokutai'] = $("#base_tokutai").val();
					obj['base_seiki'] = $("#base_seiki").val();
					obj['base_hoketu'] = $("#base_hoketu").val();
					Slist.data.srch_list[i]['biko_json'] = '$JSON$' + JSON.stringify(obj);
				}
			} else {
				//基準値を格納
				var obj = {};
				obj['base_tokutai'] = $("#base_tokutai").val();
				obj['base_seiki'] = $("#base_seiki").val();
				obj['base_hoketu'] = $("#base_hoketu").val();
				Slist.data.srch_list[i]['biko_json'] = '$JSON$' + JSON.stringify(obj);
			}
			Slist.data.srch_list[i]['hantei_syudan_cd'] = '1'; //合否自動設定
			Slist.data['srch_list'][i]['upd'] = '1';
		}

		//各状態の集計を表示する
		$("#sum_tokutai").text(tokutai_cnt);
		$("#sum_seiki").text(seiki_cnt);
		$("#sum_hoketu").text(hoketu_cnt);
		$("#sum_hu_gokaku").text(hu_gokaku_cnt);

		//合否選択変更のイベントを設定
		Slist.setChangeEvent('on');
	};

	/**
	 *
     * 送信対象データを抽出しJSON形式で戻す
	 * @return 送信形式データ
     */
	Slist.sendData = function()
	{
		var jno_list = [];
		var j = 0;
		var hoketu_juni = 1;
		for (i=0; i < Slist.data.srch_list.length; i++) {
			//if (Slist.data.srch_list[i]['upd'] == '1') {
				jno_list[j] = {};
				jno_list[j]['juken_no'] = cmncode.jnoToFull( Slist.data.srch_list[i]['juken_no'] );
				jno_list[j]['gakka_cd'] = $("#gakka_cd").val();;
				jno_list[j]['juni_bno'] = $('#' + i + '-bno').val();
				jno_list[j]['gohi_stat'] = $('#' + i + '-gohi').val();
				//<<2017/12/08
				if (!jno_list[j]['gohi_stat']) {
					jno_list[j]['gohi_stat'] = '0';
				}
				//>>
				jno_list[j]['biko_gohi'] = $('#' + i + '-biko').val() + Slist.data.srch_list[i]['biko_json'];
				jno_list[j]['hantei_syudan_cd'] = Slist.data.srch_list[i]['hantei_syudan_cd'];
				jno_list[j]['hugokaku_cd'] = Slist.data.srch_list[i]['hugokaku_cd'];
				//<<2017/6/15 見直してそのままセットする
				//jno_list[j]['sogo_juni'] = Slist.setSogoJuni(i);
				jno_list[j]['sogo_juni'] = Slist.data.srch_list[i]['juni'];
				//>>
				//補欠順位計算
				if ($('#' + i + '-hoketu').val()) {
					jno_list[j]['hoketu_juni'] = $('#' + i + '-hoketu').val();
				} else {
					jno_list[j]['hoketu_juni'] = '';
				}
				j++;
			//}
		}
		return JSON.stringify(jno_list);
	};

	/**
	 *
     * 合否手動変更時の処理
	 * @param 変更対象オブジェクト
     */
	Slist.changeGohi = function(target)
	{
		var id = target.attr('id');
		// tr の idに行番号をセットしてあるのでその情報を取得
		var cur_tr = $(target).closest('tr')[0];
		var seq = cur_tr.id;

		//id名を-で分割して解析
		var ary = id.split('-');
		if (ary[1] == 'gohi') {
			//選択の内容を見て、1次2次不合格をセット
			if (target.val() == '2') { //不合格
				Slist.data.srch_list[seq]['hugokaku_cd'] = (Slist.entryType == '1') ? '2' : '3';
			}
			Slist.data.srch_list[seq]['hantei_syudan_cd'] = '2'; //合否手動設定
			Slist.data['srch_list'][seq]['upd'] = '1';
		}

		//各状態の集計を表示する
		Slist.sumGohi();
	};

	/**
	 *
     * 合否選択イベント処理
	 * @param flg on/off
     */
	Slist.setChangeEvent = function(flg)
	{
		if (flg == 'on') {
			$('select[name="gohi_stat"]').on('change', function(e) {
				var target = $(e.target);
				Slist.changeGohi(target);
			});
		} else {
			$('select[name="gohi_stat"]').off('change');
		}
	};

	/**
	 *
     * 総合順位の再計算
	 * @param i Slistのインデックス
     */
	Slist.setSogoJuni = function(i)
	{
		if ( $('#' + i + '-bno').val() != '' ) {
			var juni = Number( Slist.data.srch_list[i]['juni'] );
			var bno =  Number( cmncode.strToHalf( $('#' + i + '-bno').val() ));
			return String( juni + (bno - 1) );

		} else {
			return Slist.data.srch_list[i]['juni'];
		}
	};

	/**
	 *
     * 合否カウントの集計
	 *
     */
	Slist.sumGohi = function()
	{
		var tokutai_cnt = 0;
		var seiki_cnt = 0;
		var hoketu_cnt = 0;
		var hu_gokaku_cnt = 0;
		var gokaku_cnt = 0;

		for (var i = 0; i < Slist.data.srch_list.length; i++) {

			selectId = '#' + i + '-gohi';
			//合否状態のカウント
			switch ($(selectId).val()) {
				case '2': //不合格
					hu_gokaku_cnt++;
					break;
				case '3': //1次合格
					gokaku_cnt++;
					break;
				case '4': //補欠
					hoketu_cnt++;
					break;
				case '5': //特待
					tokutai_cnt++;
					break;
				case '6': //正規
					seiki_cnt++;
					break;
			}
		}
		//各状態の集計を表示する
		if (Slist.entryType == '1') {
			$("#sum_gokaku").text(gokaku_cnt);
			$("#sum_hu_gokaku").text(hu_gokaku_cnt);
		} else {
			$("#sum_tokutai").text(tokutai_cnt);
			$("#sum_seiki").text(seiki_cnt);
			$("#sum_hoketu").text(hoketu_cnt);
			$("#sum_hu_gokaku").text(hu_gokaku_cnt);
		}

	};

})();
