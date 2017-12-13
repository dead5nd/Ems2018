/** 
* @fileOverview 成績入力一覧クラス
* @author FiT
* @version 1.0.0
*
* 医学部の英語 J1 数学 E7のマークシートを対象としている
* 科目コードが変更になる場合は修正が必要
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

		var j = 0;
		Slist.data = {};
		Slist.data['th_list'] = [];
		
		Slist.base_eigo ='';
		Slist.base_sugaku ='';
		
		for (var i = 0; i < list[0]['k_list'].length; i++) {
			if ( (list[0]['k_list'][i]['kamoku_cd'] == 'E7') || (list[0]['k_list'][i]['kamoku_cd'] == 'J1') ) {
				Slist.data['th_list'][j] = {};
				Slist.data['th_list'][j]['kamoku_nm_s'] = list[0]['k_list'][i]['kamoku_nm_s'];
				j++;
			}
		}
		
		Slist.data['tr_list'] = [];
		for (var i = 0; i < list.length; i++) {
			Slist.data['tr_list'][i] = {};
			Slist.data['tr_list'][i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			Slist.data['tr_list'][i]['simei'] = list[i]['simei'];
			Slist.data['tr_list'][i]['gakka_cd'] = list[i]['gakka_cd'];
			j = 0;
			Slist.data['tr_list'][i]['k_list'] = [];
			for (var k = 0; k < list[i]['k_list'].length; k++) {
				if ( (list[i]['k_list'][k]['kamoku_cd'] == 'E7') || (list[i]['k_list'][k]['kamoku_cd'] == 'J1') ) {
					list[i]['k_list'][k]['ms_score'] = cmncode.floatToInt( list[i]['k_list'][k]['ms_score'] );
					Slist.data['tr_list'][i]['k_list'][j] = {};
					Slist.data['tr_list'][i]['k_list'][j] = list[i]['k_list'][k];
					j++;
				}
			}
			Slist.data['tr_list'][i]['gohi_stat'] = list[i]['gohi_stat'];
			
			//合否備考から前回の基準値を取得する
			if ('biko_gohi' in list[i]) {
				if (list[i]['biko_gohi'].indexOf('$JSON$') !== -1) {
					var ary = list[i]['biko_gohi'].split('$JSON$');
					var obj = JSON.parse(ary[1]);
					if ('base_eigo' in obj) { Slist.base_eigo =  obj['base_eigo'] };
					if ('base_sugaku' in obj) { Slist.base_sugaku =  obj['base_sugaku'] };
					
					//合否備考を2つに分けて管理する
					Slist.data['tr_list'][i]['biko_gohi'] = ary[0];
					Slist.data['tr_list'][i]['biko_json'] = '$JSON$' + ary[1];
				} else {
					Slist.data['tr_list'][i]['biko_json'] = '';
				}
			} else {
				Slist.data['tr_list'][i]['biko_gohi'] = '';
				Slist.data['tr_list'][i]['biko_json'] = '';
			}
			
			//管理用
			Slist.data['tr_list'][i]['seq'] = i;
		}
	};
	/**
	 *
     * 一覧表示の初期処理
	 * 
     */
	Slist.initList = function()
	{
		/*
		for (var i = 0; i < Slist.data.tr_list.length; i++) {
			//合否選択欄の初期設定
			selectId = '#' + i + '-gohi';
			$(selectId).val(Slist.data.tr_list[i]['gohi_stat']);
		}
		*/
		
		//前回基準値を表示する
		$("#base_eigo").val(Slist.base_eigo);
		$("#base_sugaku").val(Slist.base_sugaku);
		
		//前回基準値をもとに再集計する
		Slist.autoSet();
		
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
			seiseki_list[i] = {};
			seiseki_list[i]['juken_no'] = cmncode.jnoToFull( Slist.data.tr_list[i]['juken_no'] );
			seiseki_list[i]['gakka_cd'] = Slist.data.tr_list[i]['gakka_cd'];
			seiseki_list[i]['gohi_stat'] = Slist.data.tr_list[i]['gohi_stat'];
			seiseki_list[i]['hantei_syudan_cd'] = Slist.data.tr_list[i]['hantei_syudan_cd'];
			seiseki_list[i]['hugokaku_cd'] = Slist.data.tr_list[i]['hugokaku_cd'];
			seiseki_list[i]['biko_gohi'] = Slist.data.tr_list[i]['biko_json'];
		}
		return JSON.stringify(seiseki_list);
	};
	
	/**
	 *
     * 足切判定の一括設定処理
	 *
     */
	Slist.autoSet = function()
	{
		var GOKAKU  = '0';
		var HU_GOKAKU  = '2';
		
		var base_eigo = $("#base_eigo").val() != '' ? Number( $("#base_eigo").val() ) : 0 ;
		var base_sugaku = $("#base_sugaku").val() != '' ? Number( $("#base_sugaku").val() ) : 0 ;
		
		var ng_eigo = 0;
		var ok_eigo = 0;
		var ng_sugaku = 0;
		var ok_sugaku = 0;
		var ng_total = 0;
		var ok_total = 0;
		
		var eigo_score;
		var sugaku_score;
		var selectId;
		var asikiri;
		var ms_score;
		
		//基準値をもとに合否を自動セット
		for (i=0; i < Slist.data.tr_list.length; i++) {
			for (var j = 0; j < Slist.data.tr_list[i]['k_list'].length; j++) {
				//成績データ取得
				if ( Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'] == 'E7') {
					sugaku_score = (Slist.data.tr_list[i]['k_list'][j]['ms_score'] == '') ? 0 : Number( Slist.data.tr_list[i]['k_list'][j]['ms_score']);
				} else if ( Slist.data.tr_list[i]['k_list'][j]['kamoku_cd'] == 'J1') {
					eigo_score =  (Slist.data.tr_list[i]['k_list'][j]['ms_score'] == '') ? 0 : Number( Slist.data.tr_list[i]['k_list'][j]['ms_score']);
				}
			}
			//基準値との比較
			asikiri = false;
			if (sugaku_score < base_sugaku) {
				ng_sugaku++;
				asikiri = true;
			} else {
				ok_sugaku++;
			}
			
			if (eigo_score < base_eigo) {
				ng_eigo++;
				asikiri = true;
			} else {
				ok_eigo++;
			}
			
			if (asikiri) {
				ng_total++;
				Slist.data.tr_list[i]['gohi_stat'] = HU_GOKAKU;
				selectId = '#' + i + '-gohi';
				$(selectId).val(HU_GOKAKU);
				Slist.data.tr_list[i]['hugokaku_cd'] = '1'; //足切不合格
				//基準値を格納
				var obj = {};
				obj['base_eigo'] = $("#base_eigo").val();
				obj['base_sugaku'] = $("#base_sugaku").val();
				Slist.data.tr_list[i]['biko_json'] = '$JSON$' + JSON.stringify(obj);
				
			} else {
				ok_total++;
				Slist.data.tr_list[i]['gohi_stat'] = GOKAKU;
				selectId = '#' + i + '-gohi';
				$(selectId).val(GOKAKU);
				Slist.data.tr_list[i]['hugokaku_cd'] = '0'; //未判定
			}
			Slist.data.tr_list[i]['hantei_syudan_cd'] = '1'; //合否自動設定
		}
		
		//各状態の集計を表示する
		$("#ng_eigo").text(ng_eigo);
		$("#ok_eigo").text(ok_eigo);
		$("#ng_sugaku").text(ng_sugaku);
		$("#ok_sugaku").text(ok_sugaku);
		$("#ng_total").text(ng_total);
		$("#ok_total").text(ok_total);
	};
	
})();
