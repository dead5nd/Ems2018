/**
 * @fileOverview Ems201イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "試験会場座席割振り";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems201ViewModel.init();
			
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
			// 試験区分選択肢のイベント
			//
			$(document).on('change', "#siken_cd", function() 
			{
				Ems201ViewModel.sikentiSelect();
			});
			
		});
		
		
	});
	
})();

