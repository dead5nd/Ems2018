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
	* @namespaceEmslogin画面のValidation定義。
	*/
	valid.Page01 = {
		rules: {
			user_id: {
				required: true
			},
			passwd: {
				required: true
			}
		},	
		messages: {
			user_id: {
				required: VMSG_REQUIRED
			},
			passwd: {
				required: VMSG_REQUIRED
			}
		},
		submitHandler: function(form) {
			EmsloginViewModel.submit();	
  		}
	};
	
	
}) ();

