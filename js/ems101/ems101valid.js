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
	* @namespaceEms101画面のValidation定義。
	*/
	valid.Page01_1 = {
		// 検索処理
		rules: {
			seiri_no: {
				minlength: 9,
				maxlength: 9,
				number: true
			}
		},	
		messages: {
			seiri_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。",
				number: VMSG_NUMBER
			}
		},
		submitHandler: function(form) {
			// 検索条件入力無効
			$(".cs-search").prop('disabled', true);
			Ems101ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		rules: {
			block_no: {
				digits: true
			}
		},	
		messages: {
			block_no: {
				digits: "数字入力"
			}
		},
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems101conf1 ,  
				function() { 
					Ems101ViewModel.submit(form);
		    		return false;
				});		
  		}
	};
	
	
	
}) ();

