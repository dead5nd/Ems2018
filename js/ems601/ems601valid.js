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
	* @namespaceEms601画面のValidation定義。
	*/
	valid.Page01 = {
		rules: {
			old_passwd: {
				required: true
			},
			new_passwd: {
				required: true,
				minlength: 8,
				alfaNumeric: true
			},
			new_passwd2: {
				required: true,
				equalTo: "#new_passwd"
			}
		},	
		messages: {
			old_passwd: {
				required: VMSG_REQUIRED
			},
			new_passwd: {
				required: VMSG_REQUIRED,
				minlength: "{0}文字以上入力してください。",
				alfaNumeric: "英数字混在で入力してください。"
			},
			new_passwd2: {
				required: VMSG_REQUIRED,
				equalTo: "再入力したパスワードが一致しません。"
			}
		},
		submitHandler: function(form) {
			Ems601ViewModel.submit();	
  		}
	};
	
	
}) ();

