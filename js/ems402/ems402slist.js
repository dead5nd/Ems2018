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
		var gohi1 = [
			{ cd: "2", name:"不合格"},
			{ cd: "4", name:"補欠"},
			{ cd: "7", name:"繰上合格"},
			{ cd: "8", name:"追加合格"},
			{ cd: "5", name:"特待合格"},
			{ cd: "6", name:"正規合格"}
		];
		var gohi2 = [
			{ cd: "2", name:"不合格"},
			{ cd: "4", name:"補欠"},
			{ cd: "7", name:"繰上合格"},
			{ cd: "8", name:"追加合格"}
		];
		
		var before_juni = 0;
		var juni;
		var selectId;
		Slist.data = {};
		Slist.data['srch_list'] = [];
		
		for (var i = 0; i < list.length; i++) {
			Slist.data['srch_list'][i] = list[i];
			Slist.data['srch_list'][i]['juken_no'] = cmncode.jnoToShort( list[i]['juken_no'] );
			Slist.data['srch_list'][i]['nokin'] = cd.nokin; 
			if (StepChk.ret.cd == '3') { //合否確定
				Slist.data['srch_list'][i]['gohi'] = gohi2; 
			} else {
				Slist.data['srch_list'][i]['gohi'] = gohi1; 
			}
			Slist.data['srch_list'][i]['upd'] = '0'; 
			
			//補欠内順位表示
			if (Ems402ViewModel.hoketu_jun == '1') {
				Slist.data['srch_list'][i]['sogo_juni'] = i + 1;
			}
			
			//受験生詳細表示用
			Slist.data['srch_list'][i]['gakubu_cd'] = Login.gakubuCd;
			Slist.data['srch_list'][i]['gakka_cd'] = $("#gakka_cd").val();
			Slist.data['srch_list'][i]['seiri_no'] = list[i]['seiri_no'] + list[i]['seiri_seq'];
			Slist.data['srch_list'][i]['log'] = encodeURI(cmncode.getTime());

			//管理用
			Slist.data['srch_list'][i]['seq'] = i;
			
		}
		
	};
	/**
	 *
     * 一覧表示の初期処理
	 *
     */
	Slist.initList = function()
	{
		var before_juni = 0;
		var juni;
		
		for (var i = 0; i < Slist.data.srch_list.length; i++) {
			//合否選択欄の初期設定
			selectId = '#' + i + '-gohi';
			$(selectId).val(Slist.data.srch_list[i]['gohi_stat']);
			if (StepChk.ret.cd == '3') { //合否確定
				switch (Slist.data.srch_list[i]['gohi_stat']) {
					case '5':
					case '6':
						$(selectId).prop('disabled', true);
						break;
					default:
						break;
				}
			}
			
			//納金選択欄の初期設定
			selectId = '#' + i + '-nokin';
			$(selectId).val(Slist.data.srch_list[i]['nokin_stat']);
		}

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
		Slist.bikoError = false; //保留の場合の備考未入力チェック
		
		for (i=0; i < Slist.data.srch_list.length; i++) {
			if ( Slist.data.srch_list[i]['upd'] == '1' ) {
				jno_list[j] = {};
				jno_list[j]['juken_no'] = cmncode.jnoToFull( Slist.data.srch_list[i]['juken_no'] );
				jno_list[j]['gakka_cd'] =  $("#gakka_cd").val();
				jno_list[j]['gohi_stat'] = Slist.data.srch_list[i]['gohi_stat'];
				jno_list[j]['nokin_stat'] = Slist.data.srch_list[i]['nokin_stat'];
				jno_list[j]['biko_kuriage'] = Slist.data.srch_list[i]['biko_kuriage'];
				if ( (jno_list[j]['nokin_stat'] == '9') && (jno_list[j]['biko_kuriage'] == '') ) {
					Slist.bikoError = true;
				}
				j++;
				
			}
		}
		return JSON.stringify(jno_list);
	};
	
	/**
	 *
     * 入力欄変更時の処理
	 * @param 変更対象オブジェクト
     */
	Slist.changeSelect = function(target)
	{
		var id = target.attr('id');
		// tr の idに行番号をセットしてあるのでその情報を取得
		var cur_tr = $(target).closest('tr')[0];
		var seq = cur_tr.id;
		
		//id名を-で分割して解析
		var ary = id.split('-');
		if (ary[1] == 'gohi') {
			var cur_stat = Slist.data.srch_list[seq]['gohi_stat'];
			var new_stat = $('#' + id).val();
			
			//繰上合格(7)は、補欠(4)のみ可能
			if (new_stat == '7') { 
				if (cur_stat == '4') {
					Slist.data.srch_list[seq]['gohi_stat'] = '7';
					Slist.data.srch_list[seq]['upd'] = '1';
				} else {
					//変更しない
				}
				//追加合格(8)は、不合格(2)のみ可能
			} else if (new_stat == '8') {
				if (cur_stat == '2') {
					Slist.data.srch_list[seq]['gohi_stat'] = '8';
					Slist.data.srch_list[seq]['upd'] = '1';
				} else {
					//変更しない
				}
			//それ以外は選択されたまま変更する
			} else {
				Slist.data.srch_list[seq]['gohi_stat'] = new_stat;
				Slist.data.srch_list[seq]['upd'] = '1';
			}

		} else if (ary[1] == 'nokin') {
			Slist.data.srch_list[seq]['nokin_stat'] = $('#' + id).val();
			Slist.data.srch_list[seq]['upd'] = '1';
		} else if (ary[1] == 'biko') {
			Slist.data.srch_list[seq]['biko_kuriage'] = $('#' + id).val();
			Slist.data.srch_list[seq]['upd'] = '1';
		}
	};	
	
	
	/**
	 *
     * 合否、納金選択イベント処理
	 *
     */
	Slist.setChangeEvent = function()
	{
		$('select[name="gohi_select"]').on('change', function(e) {
			var target = $(e.target);
			Slist.changeSelect(target);
		});
		
		$('select[name="nokin_select"]').on('change', function(e) {
			var target = $(e.target);
			Slist.changeSelect(target);
		});
		
		$('input[name="biko_kuriage"]').on('change', function(e) {
			var target = $(e.target);
			Slist.changeSelect(target);
		});
	

	};
	
	
})();
