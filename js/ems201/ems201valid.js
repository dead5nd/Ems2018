﻿/** 
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
	* @namespaceEms201画面のValidation定義。
	*/
	valid.Page01 = {
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems201conf,  
				function() { 
					Ems201ViewModel.submit();
		    		return false;
				});	
  		}
	};
	
}) ();
