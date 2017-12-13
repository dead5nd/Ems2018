/**
 * @fileOverview Ems602イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "メール送信指示　　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems602ViewModel.init();
			
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

			var validator = $("#page01form1").validate(valid.Page01_1);
			$("#page01form1").on('reset', function() 
			{
				validator.resetForm();
			});
			/*
			var validator = $("#page01form2").validate(valid.Page01_2);
			$("#page01form2").on('reset', function() 
			{
				validator.resetForm();
			});
			*/

			
			//
			// ボタンクリック時のイベント
			//
			$(document).on('click', "#page01Commit", function() 
			{
				cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems602conf1 ,  
				function() { 
					Ems602ViewModel.submit('send');
		    		return false;
				});	
				
			});
			
			$(document).on('click', "#page01Cancel", function() 
			{
				cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems602conf2 ,  
				function() { 
					Ems602ViewModel.submit('delete');
		    		return false;
				});	
			});
			
			$(document).on('click', "#page01Detail", function() 
			{
				Ems602ViewModel.searchDetail();
			});
			
		});
		
		
	});
	
})();

