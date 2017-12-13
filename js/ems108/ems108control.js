/**
 * @fileOverview Ems108イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "マイページ検索　";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems108ViewModel.init();
			
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
			// 検索結果出力ボタンクリック時のイベント
			//
			$(document).on('click', "#export", function() 
			{
				Ems108ViewModel.export();
			});
			
			//
			// カナ名リンククリックで個人情報変更処理を起動する
			//
			$(document).on('click', ".kojin_edit", function(e) 
			{
				//クリックした行のテーブル要素を取得
				var cur_tr = $(e.target).closest('tr')[0];
				
				var url = "./ems108KojinEdit.html?email=" +cur_tr.cells[3].innerText;
				window.open(url, "_blank");
				
				return false;
			});
			
			//
			// 入金状況リンククリックで入金状況変更処理を起動する
			//
			$(document).on('click', ".nyukin_edit", function(e) 
			{
				//クリックした行のテーブル要素を取得
				var cur_tr = $(e.target).closest('tr')[0];
				
				//整理番号(取引ID)は先頭カラムなのでその値を保存しておく
				Ems108ViewModel.torihiki_id = cur_tr.cells[0].innerText;
				
				$("#nyukin_edit_modal").modal(
					{
						backdrop: "false",
					}
				);
				return false;
			});
			//
			// 入金状況変更ボタンクリック時のイベント
			//
			$(document).on('click', "#nyukin_ok_modal", function() 
			{
				var stat = $("#nyukin_select_modal").val();
				
				$("#nyukin_edit_modal").modal('hide');
				Ems108ViewModel.editNyukinStat( stat );
			});
			
			//
			// メールアドレスリンククリックで通知メール処理を起動する
			//
			$(document).on('click', ".send_mail", function(e) 
			{
				//クリックした行のテーブル要素を取得
				var cur_tr = $(e.target).closest('tr')[0];
				
				//メール送信に必要な情報を取り込んでおく
				var obj = {};
				obj['jsonp'] = 'yes';
				obj['gakubu'] = cur_tr.cells[1].innerText;
				obj['email'] = cur_tr.cells[3].innerText;
				obj['password'] = cur_tr.id;
				obj['seiri_no'] = cur_tr.cells[0].innerText;
				obj['user_name'] = cur_tr.cells[4].innerText;
				obj['nyukin_ymd'] = cur_tr.cells[10].innerText;
				
				var str = cur_tr.cells[11].innerText;
				obj['kesai_kingaku'] = str.replace('円', '');
				
				obj['mail_json'] = cur_tr.cells[13].innerText;
				
				Ems108ViewModel.mailParam = obj;
				
				$("#send_mail_modal").modal(
					{
						backdrop: "false",
					}
				);
				return false;
			});
			//
			// メール送信ボタンクリック時のイベント
			//
			$(document).on('click', "#send_mail_ok_modal", function() 
			{
				var job = $("#mail_select_modal").val();
				
				$("#send_mail_modal").modal('hide');
				Ems108ViewModel.sendMail( job );
			});
			
		});
		
		
	});
	
})();

