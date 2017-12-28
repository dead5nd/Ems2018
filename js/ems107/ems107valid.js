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
	* @namespaceEms107画面のValidation定義。
	*/
	valid.Page01 = {
		rules: {
			date_from: {
				required: true
			},
			date_to: {
				required: true
			}
		},
		messages: {
			date_from: {
				required: VMSG_REQUIRED
			},
			date_to: {
				required: VMSG_REQUIRED
			}
		},
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行',
				stngcode.msg.ems107conf,
				function() {
					Ems107ViewModel.submit();
		    		return false;
				});
  		}
	};

}) ();
