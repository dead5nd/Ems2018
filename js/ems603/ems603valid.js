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
	* @namespaceSpa101画面のValidation定義。
	*/
	valid.Page01_1 = {
		// 検索処理
		rules: {
			seiri_no: {
				minlength: 9,
				maxlength: 11
			},
			juken_no: {
				minlength: 4,
				maxlength: 6
			}
		},	
		messages: {
			seiri_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。"
			},
			juken_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。"
			}
		},
		submitHandler: function(form) {
			// 検索条件入力無効
			$(".cs-search").prop('disabled', true);
			// CSVアプロード操作非表示
			$("#csv_upload").hide();
			Ems501ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		// CSVアプロード
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
				stngcode.msg.ems501conf ,  
				function() { 
					Ems501ViewModel.submit(form);
		    		return false;
				});		
  		}
	};
	
	
	
}) ();

