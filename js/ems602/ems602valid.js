/** 
 * @fileOverview 設定値を定義します
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	* @namespace 共通のエラーメッセージを定義します。
	*/
	var VMSG_REQUIRED = "入力が必要な項目です。";
	var VMSG_NUMBER = "半角数字で入力してください。";

	valid = {};
	/**
	* @namespaceEms602画面のValidation定義。
	*/
	valid.Page01_1 = {

		submitHandler: function(form) {
			// 検索条件入力無効
			//$(".cs-search").prop('disabled', true);
			Ems602ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		submitHandler: function(form) {
			Ems602ViewModel.submit();	
  		}
	};
	
	
	
}) ();

