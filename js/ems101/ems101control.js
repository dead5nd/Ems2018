/**
 * @fileOverview Ems101イベントコンロトール
 * @author FiT
 * @version 1.0.0
 * 2017/5/3 検索条件の追加に伴い試験会場選択肢の更新イベント
 *          検索結果のCSV出力イベント
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "受付書類チェック　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems101ViewModel.init();
			
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
			
			var validator = $("#page01form2").validate(valid.Page01_2);
			$("#page01form2").on('reset', function() 
			{
				validator.resetForm();
			});
			//
			// 再検索ボタンクリック時のイベント
			//
			$(document).on('click', "#page01Cancel", function() 
			{
				Ems101ViewModel.reSearch();
			});
			
			//
			// 調査書形式出力ボタンクリック時のイベント
			//
			$(document).on('click', "#export", function() 
			{
				Ems101ViewModel.export();
			});
			
			//
			// 一覧再描画ボタンクリック時のイベント
			//
			$(document).on('click', "#listReDraw", function() 
			{
				Ems101ViewModel.listReDraw();
			});
			
			//
			// 試験区分選択肢のイベント
			//
			//<<2017/5/3
			$(document).on('change', "#siken_cd", function() 
			{
				Ems101ViewModel.sikentiSelect();
			});
			
			//
			// 検索結果出力ボタンクリック時のイベント
			//
			$(document).on('click', "#exportList", function() 
			{
				Ems101ViewModel.exportList();
			});
			//>>
		});
		
		
	});
	
})();

