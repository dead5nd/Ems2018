/**
 * @fileOverview Ems603イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		menu.title = "業務処理フェーズ確定";
		
		$("#dialogParts").load("dialog.html");
		
		//
		//MENU読み込みが終わってから処理する
		//
		$("#menuParts").load("menu.html", function() {
			Login.check();
			
			//
			//画面初期処理
			//
			Ems603ViewModel.init();
			
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
			//var validator = $("#page01form").validate(valid.Page01_1);
			//$("#page01form").on('reset', function() 
			//{
			//	validator.resetForm();
			//});
			
			//
			// 確定登録ボタンクリック時のイベント
			//
			$(document).on('click', "#page01Commit", function() 
			{
				//現在のフェーズを確認
				var siken_cd = $("#siken_cd").val();
				var gakka_cd = $("#gakka_cd").val();
				StepChk.show(siken_cd, gakka_cd, 
					function () {
						if (StepChk.ret['cd'] != '9') {
							var msg = '現在の事務フェーズは「' + StepChk.ret['name'] +'」です<br><br>' + stngcode.msg.ems603conf1;
							
							cmncode.dlg.confMessage('確認', 'キャンセル', '実行', msg,
							function() { 
								Ems603ViewModel.phaseCheck();
					    		return false;
							});	
						} else {
							cmncode.dlg.alertMessage('エラー', ret['name']);
						}
					});
				
				
			});
			
			//
			// 前の状態に戻すボタンクリック時のイベント
			//
			$(document).on('click', "#page01Cancel", function() 
			{
				//現在のフェーズを確認
				var siken_cd = $("#siken_cd").val();
				var gakka_cd = $("#gakka_cd").val();
				StepChk.show(siken_cd, gakka_cd, 
					function () {
						if (StepChk.ret['cd'] != '9') {
							var msg = '現在の事務フェーズは「' + StepChk.ret['name'] +'」です<br><br>' + stngcode.msg.ems603conf2;
							
							cmncode.dlg.confMessage('確認', 'キャンセル', '実行', msg,
							function() { 
								Ems603ViewModel.phaseCancel();
					    		return false;
							});	
						} else {
							cmncode.dlg.alertMessage('エラー', ret['name']);
						}
					});
			});
		});
		
		
	});
	
})();

