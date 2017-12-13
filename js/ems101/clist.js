/** 
* @fileOverview 受付チェック一覧クラス
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
	Clist = function()
	{
	};
	
	/**
	 *
     * 受付チェック一覧初期表示
	 *
     */
	Clist.init = function()
	{		
		// 受付状況の値による設定
		var seq;
		for (i=0; i < Clist.data.length; i++) {
			seq = '#' + Clist.data[i].seq;
			if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['OK']['cd']) {
				$(seq).css('background-color',  stngcode.UKETUKE['OK']['bgcolor']);
				
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['NG']['cd']) {
				$(seq).css('background-color',  stngcode.UKETUKE['NG']['bgcolor']);	
				
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['CAN']['cd']) {
				$(seq+'uketuke_stat').prop('disabled', true);
				$(seq+'ok_bi').prop('disabled', true);
				$(seq+'biko').prop('disabled', true);
				
			} else if (Clist.data[i]['uketuke_stat'] == stngcode.UKETUKE['INI']['cd']) {
				// 再描画時の対応
				if (Clist.data[i]['upd'] == '1') {
					$(seq).css('background-color',  stngcode.UKETUKE['INI']['bgcolor']);
				}
				$(seq+'uketuke_stat').val('');
			} 
		}
	};	
	
	/**
	 *
     * テキストBOX入力時の処理
	 * @param 変更対象オブジェクト
     */
	Clist.edit = function(target)
	{
		var name = target.attr('name');
		var id = target.attr('id');
		
		var cur_tr = $(target).closest('tr')[0];
		// tr の idに行番号をセットしてあるのでその情報を取得
		var seq = cur_tr.id;

		// 受験番号発行済みの場合確認を行う
		if ((Clist.data[Number(seq)]['juken_no'] != '' )) {
			cmncode.dlg.confMessageCB('確認', 'キャンセル', '実行', 
				stngcode.msg.ems101conf3 ,  
				function() { 
					Clist.goEdit(target);
		    		return false;
				},
				function() { 
					// キャンセルされた場合は入力値を元に戻す
					$('#' + seq +'uketuke_stat').val( Clist.data[Number(seq)]['uketuke_stat'] );
		    		return false;
				}
			);	
		} else {
			Clist.goEdit(target);
		}

	};
	/**
	 *
     * テキストBOX入力時の処理
	 * @param 変更対象オブジェクト
     */
	Clist.goEdit = function(target)
	{
		var name = target.attr('name');
		var id = target.attr('id');
		
		var cur_tr = $(target).closest('tr')[0];
		// tr の idに行番号をセットしてあるのでその情報を取得
		var seq = cur_tr.id;
		var s_seq = '#' + seq;
		
		var uketuke_stat = $(s_seq+'uketuke_stat').val();
		var block_no = $("#block_no").val();
		
		if (name == 'uketuke_stat') {
			if ( uketuke_stat == stngcode.UKETUKE['OK']['cd'] ) {
				$(s_seq).css('background-color',  stngcode.UKETUKE['OK']['bgcolor']);	
				$(s_seq+'M').text(stngcode.UKETUKE['OK']['name']);
				$(s_seq+'ok_bi').val(cmncode.getToday());
				$(s_seq+'block_no').text(block_no);
				Clist.recUpdate(seq); //更新マーク
				
			} else if ( uketuke_stat == stngcode.UKETUKE['NG']['cd']) {
				$(s_seq).css('background-color',  stngcode.UKETUKE['NG']['bgcolor']);
				$(s_seq+'M').text(stngcode.UKETUKE['NG']['name']);
				$(s_seq+'ok_bi').val('');
				$(s_seq+'block_no').text('');
				Clist.recUpdate(seq); //更新マーク
				
			} else if ( uketuke_stat == '') {
				$(s_seq).css('background-color',  stngcode.UKETUKE['INI']['bgcolor']);
				$(s_seq+'M').text('');
				$(s_seq+'ok_bi').val('');
				$(s_seq+'biko').val('');
				$(s_seq+'block_no').text('');
				Clist.recUpdate(seq); //更新マーク
				
			} else {
				//更新前の値をチェック
				if ( (Clist.data[Number(seq)]['uketuke_stat'] != '' ) && (Clist.data[Number(seq)]['uketuke_stat'] != '0' ) ){
					$(s_seq).css('background-color',  stngcode.UKETUKE['INI']['bgcolor']);
					$(s_seq+'uketuke_stat').val('');
					$(s_seq+'M').text('');
					$(s_seq+'ok_bi').val('');
					$(s_seq+'biko').val('');
					$(s_seq+'block_no').text('');
					Clist.recUpdate(seq); //更新マーク
					
				} else {
					//$(s_seq).css('background-color',  stngcode.UKETUKE['CAN']['bgcolor']);
					$(s_seq+'uketuke_stat').val('');
					$(s_seq+'M').text('');
					$(s_seq+'ok_bi').val('');
					$(s_seq+'biko').val('');
					$(s_seq+'block_no').text('');
				}
			} 
			
		} else if (name == 'ok_bi') {
			Clist.recUpdate(seq); //更新マーク
		} else if (name == 'biko') {
			Clist.recUpdate(seq); //更新マーク
		}
	};	
	
	/**
	 *
     * 該当行が更新されたことを記録する
	 * @param 変更対象管理番号
     */
	Clist.recUpdate = function(seq)
	{
		var i = Number(seq);
		var s_seq = '#' + seq;
		var uketuke_stat = $(s_seq+'uketuke_stat').val();
		if (uketuke_stat == '') { uketuke_stat = '0'; } //未到着
		
		Clist.data[i]['upd'] = '1';
		Clist.data[i]['uketuke_stat'] = uketuke_stat;
		Clist.data[i]['ok_bi'] = $(s_seq+'ok_bi').val();
		Clist.data[i]['biko'] = $(s_seq+'biko').val();
		Clist.data[i]['block_no'] = $(s_seq+'block_no').text();
		Clist.data[i]['M'] = $(s_seq+'M').text();
		//書類チェック日の設定
		if ( Clist.data[i]['check_bi'] == '') {
			if ( uketuke_stat == '0') {
				Clist.data[i]['check_bi'] = '';
			} else {
				Clist.data[i]['check_bi'] = cmncode.getToday();
				$(s_seq+'check_bi').text( Clist.data[i]['check_bi'] );
			}
		} else {
			if ( uketuke_stat == '0') {
				Clist.data[i]['check_bi'] = '';
				$(s_seq+'check_bi').text( Clist.data[i]['check_bi'] );
			}
		}
		
	};	

	/**
	 *
     * 送信対象データを抽出しJSON形式で戻す
	 * @return 送信形式データ
     */
	Clist.sendData = function()
	{
		var data = [];
		var j = 0;
		for (i=0; i < Clist.data.length; i++) {
			if ( Clist.data[i]['upd'] == '1' ) {
				data[j] = {};
				data[j]['seiri_no'] = Clist.data[i]['seiri_no'];
				data[j]['seiri_seq'] = Clist.data[i]['seiri_seq'];
				data[j]['uketuke_stat'] = Clist.data[i]['uketuke_stat'];
				data[j]['ok_bi'] = Clist.data[i]['ok_bi'];
				data[j]['check_bi'] = Clist.data[i]['check_bi'];
				data[j]['biko'] = Clist.data[i]['biko'];
				data[j]['block_no'] = Clist.data[i]['block_no'];
				j++;
			}
		}
		return JSON.stringify(data);
	};	
	
})();
