/**
 * @fileOverview Ems403イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "学納金データ出力　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems403ViewModel.init();
			
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
			
			//
			// CSV出力ボタンクリック時のイベント
			//
			$(document).on('click', "#export", function() 
			{
				Ems403ViewModel.export();
			});
			
		});
		
		
	});
	
})();

