/**
 * @fileOverview Ems103イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "出願情報取得　　　　";
		
		$("#dialogParts").load("dialog.html");
		//
		//ログインチェックとMENU表示
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			//
			//画面初期処理
			//
			Ems103ViewModel.init();
			
			// 
			// Enter入力でのSubmit動作を無効にする
			// inputタグのクラスにallow_submitを入れた場合は有効
			//
			$(document).on("keypress", "input:not(.allow_submit)", function(event) {
	   			 return event.which !== 13;
	  		});
			
			//
			//インターネット出願からデータ抽出する
			//
			$(document).on('click', "#inportNetEntry", function(e) 
			{
				cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems103conf ,  
				function() { 
					Ems103ViewModel.getImportData();
		    		return false;
				});		

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

