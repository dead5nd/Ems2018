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
	* @namespaceEms406画面のValidation定義。
	*/
	valid.Page01 = {
		rules: {
			csv_file: {
				required: true

			}
		},	
		messages: {
			csv_file: {
				required: VMSG_REQUIRED
			}
		},
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems406conf ,  
				function() { 
					Ems406ViewModel.submit(form);
		    		return false;
				});		
  		}
	};
	
	
}) ();

