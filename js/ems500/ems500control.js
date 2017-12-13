/**
 * @fileOverview Ems500イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		
		$("#dialogParts").load("dialog.html");
		
		//Login.check();
		
		//
		//画面初期処理
		//
		Ems500ViewModel.init();
			
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
		// 出願キャンセルボタン
		//
		$(document).on('click', "#syutuganCalcel", function() 
		{
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems500conf2 ,  
				function() { 
					Ems500ViewModel.syutuganCancel();
		    		return false;
				});	
			
		});
		//
		// 受験番号キャンセルボタン
		//
		$(document).on('click', "#jukenCancel", function() 
		{
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems500conf3 ,  
				function() { 
					Ems500ViewModel.jukenCalcelPre();
		    		return false;
				});	
			
		});
		//
		// 座席手動割振ボタン
		//
		$(document).on('click', "#syudoWarihuri", function() 
		{
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems500conf4 ,  
				function() { 
					Ems500ViewModel.syudoWarihuri();
		    		return false;
				});	
			
		});
		//
		// 調査書情報登録ボタン
		//
		$(document).on('click', "#chosaToroku", function() 
		{
			cmncode.dlg.confMessage('確認', 'キャンセル', '実行', 
				stngcode.msg.ems500conf5 ,  
				function() { 
					Ems500ViewModel.chosaToroku();
		    		return false;
				});	
			
		});
	});
	
})();

