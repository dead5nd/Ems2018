/** 
* @fileOverview Ems305画面表示・ビジネスロジック
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
	Ems305ViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	Ems305ViewModel.init = function()
	{
		
	};	
	
	/**
	 *
     * Submit処理
	 *
     */
	Ems305ViewModel.submit = function() {
		var chohyo = $("#chohyo").val();
	
		if (chohyo == '1') {
			//成績点検・一覧表
			window.open(
				stngcode.ajax.sikenExcel,
				'_blank'
			);
		} else if (chohyo == '2') {
			//採点者割当表
			window.open(
				stngcode.ajax.saitenWariateExcel,
				'_blank'
			);
			
		} else if (chohyo == '3') {
			//面接予定表
			window.open(
				stngcode.ajax.mensetuYoteiExcel,
				'_blank'
			);
			
		} 

	};	


	
})();
