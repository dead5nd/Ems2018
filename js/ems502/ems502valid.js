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
	* @namespaceEms502画面のValidation定義。
	*/
	valid.Page01_1 = {
		// 検索処理
		rules: {
			seiri_no: {
				minlength: 9,
				maxlength: 11,
				number: true
			},
			juken_no: {
				minlength: 4,
				maxlength: 6,
				number: true
			},
			heigan_seq: {
				number: true
			}
		},	
		messages: {
			seiri_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。",
				number: VMSG_NUMBER
			},
			juken_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。",
				number: VMSG_NUMBER
			},
			heigan_seq: {
				number: VMSG_NUMBER
			}
		},
		submitHandler: function(form) {
			// 検索条件入力無効
			$(".cs-search").prop('disabled', true);
			// CSVアプロード操作非表示
			$("#csv_upload").hide();
			Ems502ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		submitHandler: function(form) {
			Ems502ViewModel.submit();	
  		}
	};
	
	
	
}) ();

