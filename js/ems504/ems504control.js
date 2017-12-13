/**
 * @fileOverview Ems504イベントコンロトール
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
		Ems504ViewModel.init();
			
		// 
		// Enter入力でのSubmit動作を無効にする
		// inputタグのクラスにallow_submitを入れた場合は有効
		//
		$(document).on("keypress", "input:not(.allow_submit)", function(event) {
	   		 return event.which !== 13;
	  	});

	});
	
})();

