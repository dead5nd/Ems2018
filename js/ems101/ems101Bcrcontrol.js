/**
 * @fileOverview Ems101イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "バーコード受付　　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems101BcrViewModel.init();
			
			
			//
			//バーコード入力欄でのEnter検出
			//
			$(document).on("keydown", "#bcr", function(e) {
				
				var c = e.which ? e.which : e.keyCode;
				switch (c) {
				//Enterキーでフォーカスアウトせず、受付登録する
				case 13:
					var scan = $("#bcr").val();
					if (scan.length < 15) {
						//バーコードの長さに満たない場合は何もしない
					} else {
						//受付情報を登録し一覧に表示する
						Ems101BcrViewModel.regist(scan);
					}
					break;

				}
			});
			//
			//バーコード入力欄フォーカスでデータクリア
			//
			$(document).on("focus", "#bcr", function(e) {
				$(e.target).val('');
	
			});

		});
		
		
	});
	
})();

