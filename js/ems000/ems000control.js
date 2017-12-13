/**
 * @fileOverview Ems000イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "入試管理システム　　";
		//
		//ログインチェックとMENU表示
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
		});
		
		//
		//画面初期処理
		//
		Ems000ViewModel.init();
		
		
	});
	
})();

