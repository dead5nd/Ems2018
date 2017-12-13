/**
 * @fileOverview Ems401イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "合否入力　　　　　　";
		
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems401ViewModel.init();
			
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
			// 試験区分選択肢のイベント
			//
			$(document).on('change', "#siken_cd", function() 
			{
				Ems401ViewModel.jiSelect();
				Ems401ViewModel.wakuSelect();
			});
			
			//
			// 一括設定ボタンクリック時のイベント
			//
			$(document).on('click', "#page01AutoSet", function() 
			{
				Slist.autoSet();
			});
			
			//
			// 合否状況集計ボタンクリック時のイベント
			//
			$(document).on('click', "#page01Summary", function() 
			{
				Ems401ViewModel.gohiSummary();
			});
		});
		
		
	});
	
})();
