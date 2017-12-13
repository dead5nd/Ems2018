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
	* @namespaceEms302画面のValidation定義。
	*/
	valid.Page01_1 = {
		// 検索処理
		rules: {
//			yosi_no: {
//				required: function(){return ($('#kamoku_cd').val() != '');},
//				number: true
//			},
			cnt_juken_no: {
				number: true
			},
			end_juken_no: {
				minlength: 4,
				maxlength: 6,
				number: true
			},
			start_juken_no: {
				minlength: 4,
				maxlength: 6,
				number: true,
				required: function(){
					if ($('#cnt_juken_no').val() != '') {
						return true;
					} else if ($('#end_juken_no').val() != '') {
						return true;
					} else {
						return false;
					}
					
				}
			}
		},	
		messages: {
//			yosi_no: {
//				required: VMSG_REQUIRED,
//				number: VMSG_NUMBER
//			},
			cnt_juken_no: {
				number: VMSG_NUMBER
			},
			start_juken_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。",
				number: VMSG_NUMBER,
				required: VMSG_REQUIRED
			},
			end_juken_no: {
				minlength: "{0}文字以上で入力してください。",
				maxlength: "{0}文字以下で入力してください。",
				number: VMSG_NUMBER
			}
		},
		submitHandler: function(form) {
			// 検索条件入力無効
			$(".cs-search").prop('disabled', true);
			Ems302ViewModel.search();	
  		}
	};
	
	valid.Page01_2 = {
		submitHandler: function(form) {
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems302conf ,  
				function() { 
					Ems302ViewModel.submit(form);
		    		return false;
				});		
  		}
	};
}) ();

