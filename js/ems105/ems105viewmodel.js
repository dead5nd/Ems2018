/** 
* @fileOverview Ems105画面表示・ビジネスロジック
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
	Ems105ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems105ViewModel.init = function()
	{
		
	};	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems105ViewModel.submit = function() {
		var chohyo = $("#chohyo").val();
	
		if (chohyo == '1') {
			//受付状況集計表
			window.open(
				stngcode.ajax.uketukeExcel,
				'_blank'
			);
			
		} else if (chohyo == '2') {
			//受験番号ラベル印刷
			window.open(
				stngcode.ajax.labelPrintExcel,
				'_blank'
			);
		}

	};	


	
})();
