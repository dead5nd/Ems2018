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
	* @namespaceEms103画面のValidation定義。
	*/
	valid.Page01 = {
		rules: {
			siken_cd: {
				required: true

			}
		},	
		messages: {
			siken_cd: {
				required: VMSG_REQUIRED
			}
		}

	};
	
	
}) ();

