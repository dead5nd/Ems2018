/**
 * @fileOverview Ems501イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "受験生情報照会　　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems501ViewModel.init();
			
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
				// 検索条件入力有効
				$(".cs-search").prop('disabled', false);
				// 検索結果非表示
				$("#table_Tmpl").children().remove();
				// 検索画面開く
				$("#searchAccCollapse").collapse('show');
			});
			
			//
			// 学事連携出力ボタンクリック時のイベント
			//
			$(document).on('click', "#export1", function() 
			{
				Ems501ViewModel.export1();
			});
			
			//
			// 検索結果出力ボタンクリック時のイベント
			//
			$(document).on('click', "#export2", function() 
			{
				Ems501ViewModel.export2();
			});
			//
			// 試験区分選択肢のイベント
			//
			$(document).on('change', "#siken_cd", function() 
			{
				Ems501ViewModel.sikentiSelect();
			});
		});
		
		
	});
	
})();

