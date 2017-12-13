/** 
* @fileOverview Emslogin画面表示・ビジネスロジック
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
	EmsloginViewModel = function()
	{
	};
	
	/**
	 *
     * 画面生成時の初期処理
	 *
     */
	EmsloginViewModel.init = function()
	{

	};	
	
	
	/**
	 *
     * Submit処理
	 *
     */
	EmsloginViewModel.submit = function()
	{
		var id = $("#user_id").val();
		var pwd = $("#passwd").val();
		
		Login.auth(id, pwd);
	
	};	
	
})();
