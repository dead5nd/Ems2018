/**
 * @fileOverview Ems303イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "無成績者欠席登録　　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems303ViewModel.init();
			
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
				// 検索画面表示
				$("#searchAccCollapse").collapse('show');
			});
			
			//
			// 試験区分選択肢のイベント
			//
			$(document).on('change', "#siken_cd", function() 
			{
				Ems303ViewModel.kamokuSelect();
				Ems303ViewModel.jiSelect();
			});
			
			//
			// 学科選択肢のイベント
			//
			$(document).on('change', "#gakka_cd", function() 
			{
				Ems303ViewModel.kamokuSelect();
			});
			
			//
			// 1次2次選択肢のイベント
			//
			$(document).on('change', "#12ji_kubun", function() 
			{
				Ems303ViewModel.kamokuSelect();
			});
			
			
		});
		
		
	});
	
})();
