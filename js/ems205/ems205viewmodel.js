/** 
* @fileOverview Ems205画面表示・ビジネスロジック
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
	Ems205ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems205ViewModel.init = function()
	{
		
	};	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems205ViewModel.submit = function() {
		var chohyo = $("#chohyo").val();
	
		if (chohyo == '1') {
			//会場掲示物印刷
			window.open(
				stngcode.ajax.kaijoKeijiExcel,
				'_blank'
			);
		}

	};	


	
})();
