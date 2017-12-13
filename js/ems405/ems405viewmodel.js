/** 
* @fileOverview Ems405画面表示・ビジネスロジック
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
	Ems405ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems405ViewModel.init = function()
	{
		
	};	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems405ViewModel.submit = function() {
		var chohyo = $("#chohyo").val();
	
		if (chohyo == '1') {
			//通知書類印刷
			window.open(
				stngcode.ajax.tutiExcel,
				'_blank'
			);
			
		} else if (chohyo == '2') {
			//宛名ラベル印刷
			window.open(
				stngcode.ajax.atenaExcel,
				'_blank'
			);
		} else if (chohyo == '3') {
			//合格者一覧
			window.open(
				stngcode.ajax.gokakuListExcel,
				'_blank'
			);
		}

	};	


	
})();
