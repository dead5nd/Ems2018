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

	valid = {};
	/**
	* @namespaceEms304画面のValidation定義。
	*/
	valid.Page01_1 = {
		submitHandler: function(form) {
			// 検索条件入力無効
			Ems304ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				Ems304ViewModel.setConfMessage() ,  
				function() { 
					Ems304ViewModel.submit();
		    		return false;
				});		
  		}
	};
	
	
	
}) ();

