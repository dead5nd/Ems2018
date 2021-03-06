/**
 * @fileOverview Ems307イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "欠席一括入力　　　　";

		$("#dialogParts").load("dialog.html");
		//
		//ログインチェックとMENU表示
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			//
			//画面初期処理
			//
			Ems307ViewModel.init();
			
			// 
			// Enter入力でのSubmit動作を無効にする
			// inputタグのクラスにallow_submitを入れた場合は有効
			//
			$(document).on("keypress", "input:not(.allow_submit)", function(event) {
	   			 return event.which !== 13;
	  		});
			
			//
			// Validationチェックルールを登録
			//		
			var validator = $("#page01form").validate(valid.Page01);
			$("#page01form").on('reset', function() 
			{
				validator.resetForm();
			});
		});

	});
	
})();

