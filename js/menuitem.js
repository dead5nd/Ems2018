/** 
 * @fileOverview MENU設定値を定義します
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	 * @namespace 設定値を定義します。
	 */
	menu = {};
	
	menu.title='';
	
	menu.itemList = {
		MENU0:[
			{ cd: "103", url: "./ems103WebImp2.html", name:"　出願情報取得"},
			{ cd: "107", url: "./ems107WebUpd.html", name:"　マイページ受付状況更新"},
			{ cd: "108", url: "./ems108Kanri.html", name:"　マイページ検索"}
		],
		MENU1:[
			{ cd: "106", url: "./ems101Bcr.html", name:"　バーコード受付"},	
			{ cd: "101", url: "./ems101Chk.html", name:"　受付書類チェック"},
			{ cd: "102", url: "./ems102Jno.html", name:"　受験番号発行"},
			{ cd: "105", url: "./ems105ExcelP.html", name:"　受付関連帳票"}
		],
		MENU2:[
			{ cd: "104", url: "./ems104WebExp.html", name:"　受験番号登録"},	
			{ cd: "201", url: "./ems201SeatRsv.html", name:"　試験会場座席割振り"}
		],
		MENU3:[
			
			{ cd: "502", url: "./ems502Mail.html", name:"　一斉通知メール"},
			{ cd: "602", url: "./ems602MailApp.html", name:"　一斉メール送信指示"},
			{ cd: "503", url: "./ems503MailHis.html", name:"　一斉メール送信履歴確認"}
		],
		MENU4:[
			{ cd: "301", url: "./ems301ScoreImp.html", name:"　成績一括入力"},
			{ cd: "307", url: "./ems307KetuImp.html", name:"　欠席一括入力"},
			{ cd: "302", url: "./ems302ScoreEntry.html", name:"　成績入力"},
			{ cd: "303", url: "./ems303KetuBatch.html", name:"　無成績者欠席登録"},
			{ cd: "306", url: "./ems306Asikiri.html", name:"　足切登録"},
			{ cd: "304", url: "./ems304TotalScore.html", name:"　総合点算出"}
		],
		MENU5:[
			{ cd: "406", url: "./ems406GohiImp.html", name:"　合否判定一括入力"},	
			{ cd: "401", url: "./ems401PassEntry.html", name:"　合否判定入力"},
			{ cd: "402", url: "./ems402CarryPass.html", name:"　繰上合格"},
			{ cd: "403", url: "./ems403GakuExp.html", name:"　学納金データ出力"},
			{ cd: "404", url: "./ems404Gno.html", name:"　学籍番号発行"}
		],
		
		MENU6:[
			{ cd: "501", url: "./ems501Ref.html", name:"　受験生情報照会"},	
			{ cd: "603", url: "./ems603Pcomit.html", name:"　事務処理フェーズ確定"},
			{ cd: "103", url: "./ems103WebImp.html", name:"　出願CSVインポート"},	
			{ cd: "601", url: "./ems601PassChange.html", name:"　パスワード変更"},
			{ cd: "604", url: "./ems604MstImp.html", name:"　マスタデータインポート"}
		]
	};
		
}) ();

