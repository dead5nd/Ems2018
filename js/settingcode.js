/**
 * @fileOverview 設定値を定義します
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	 * @namespace 設定値を定義します。
	 */
	stngcode = {};

	/**
	 * 学部コード
	 */
	stngcode.IGAKU = '1';
	stngcode.IRYOKAGAKU = '2';
	stngcode.KANSEN = '3';

	/**
	 * 受付状態コード
	 */
	 stngcode.UKETUKE = {
	 	"INI":{ cd: "0", name:"", bgcolor:"#FFFAAF"},
		"OK":{ cd: "1", name:"ＯＫ", bgcolor:"#C1E5E8"},
		"OK2":{ cd: "4", name:"学籍OK", bgcolor:"#C1E5E8"},
	 	"NG":{ cd: "2", name:"不備", bgcolor:"#FFE9F2"},
	 	"CAN":{ cd: "3", name:"ｷｬﾝｾﾙ", bgcolor:""}
	 };

	
	/**
	 * URL定義
	 */
	stngcode.topUrl = './ems000Top.html';
	stngcode.loginUrl = './emsLogin.html';
	stngcode.dataTableJpnUrl = 'https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json';

	/**
	 * 履修年度既定値の設定
	 * この値がセットされていた場合には本年度の値として利用される
	 * 0の場合にはシステム日付から年度を判定する
	 */
	stngcode.sysNendo = 0;

	/**
	 * 共通のエラーメッセージ
	 */
	stngcode.ermsg_search = 'が見つかりません。<br>指定条件を確認してください。';


	/**
	 * @namespace 通信に関する設定値を定義します。
	 */
	stngcode.ajax = {};
	/**
	 * 通信タイムアウト（ミリ秒）
	 */
	stngcode.ajax.timeOut = 90000;

	/**
	 * ベースURL設定
	 */
	//stngcode.ajax.baseSvUrl = "http://" + location.host + "/nyushi2018/"; //TEST
	stngcode.ajax.baseSvUrl = "https://" + location.host + "/ems2018/"; //本番

	/**
	 * 一斉メール送信時の同時送信件数
	 */
	stngcode.ajax.sendMax = 20;


	/**
	 * ログイン認証
	 */
	stngcode.ajax.loginUrl = stngcode.ajax.baseSvUrl + "UserNinsho.aspx";

	/**
	 * パスワード変更
	 */
	stngcode.ajax.passChangeUrl = stngcode.ajax.baseSvUrl + "PassWordHenko.aspx";

	/**
	 * WEB出願インポート
	 */
	stngcode.ajax.webImpUrl = stngcode.ajax.baseSvUrl + "WEBSyutsuganDataImport.aspx";

	/**
	 * WEB出願エクスポート
	 */
	stngcode.ajax.webExpUrl = stngcode.ajax.baseSvUrl + "WEBSyutuganDataExport.aspx";

	/**
	 *受付書類チェック(検索)
	 */
	stngcode.ajax.entChkUrl = stngcode.ajax.baseSvUrl + "UketukeSyoruiCheckKensaku.aspx";

	/**
	 *受付書類チェック(登録)
	 */
	stngcode.ajax.entChkRegUrl = stngcode.ajax.baseSvUrl + "UketukeSyoruiCheckToroku.aspx";

	/**
	 * 受験番号発行対象検索
	 */
	stngcode.ajax.jnoUrl = stngcode.ajax.baseSvUrl + "JukennoHakkoTaisyoKensaku.aspx";

	/**
	 * 受験番号発行
	 */
	stngcode.ajax.jnoGoUrl = stngcode.ajax.baseSvUrl + "JukennoHakko.aspx";

	/**
	 * 受験生一覧検索
	 */
	stngcode.ajax.jgRefUrl = stngcode.ajax.baseSvUrl + "JukenseiListSearch.aspx";

	/**
	 * 受験生追加情報一括登録
	 */
	stngcode.ajax.jgImpUrl = stngcode.ajax.baseSvUrl + "JukenseiAddInfoIkkatuToroku.aspx";

	/**
	 * 受験生詳細情報検索
	 */
	stngcode.ajax.jgDetUrl = stngcode.ajax.baseSvUrl + "JukenseiDetailInfoSearch.aspx";

	/**
	 * 受験生情報変更登録
	 */
	stngcode.ajax.jgUpdUrl = stngcode.ajax.baseSvUrl + "JukenseiInfoHenkoToroku.aspx";

	/**
	 *出願キャンセル
	 */
	stngcode.ajax.jgCanUrl = stngcode.ajax.baseSvUrl + "SyutuganCancel.aspx";

	/**
	 *受験番号キャンセル
	 */
	stngcode.ajax.jnoCanUrl = stngcode.ajax.baseSvUrl + "JukennoCancel.aspx";

	/**
	 *座席手動割振り
	 */
	stngcode.ajax.seatManuUrl = stngcode.ajax.baseSvUrl + "ZasekiSyudoWarihuri.aspx";

	/**
	 *受験番号確定処理
	 */
	stngcode.ajax.jnoCmmtUrl = stngcode.ajax.baseSvUrl + "JukenNoKakute.aspx";

	/**
	 *処理進捗戻し処理
	 */
	stngcode.ajax.phaseCanUrl = stngcode.ajax.baseSvUrl + "SyoriSinchokuModosi.aspx";

	/**
	 *座席割当処理
	 */
	stngcode.ajax.seatRsvUrl = stngcode.ajax.baseSvUrl + "ZasekiWarifuriSyori.aspx";

	/**
	 *マスタデータインポート
	 */
	stngcode.ajax.mstImpUrl = stngcode.ajax.baseSvUrl + "MasterDataImport.aspx";

	/**
	 *処理進捗状況検索
	 */
	stngcode.ajax.stepChkUrl = stngcode.ajax.baseSvUrl + "SyoriSinchokuJokyoKensaku.aspx";

	/**
	 *試験データインポート
	 */
	stngcode.ajax.scoreImpUrl = stngcode.ajax.baseSvUrl + "SikenDataImport.aspx";

	/**
	 *センター試験データインポート
	 */
	stngcode.ajax.centerImpUrl = stngcode.ajax.baseSvUrl + "CenterSikenDataImport.aspx";

	/**
	 *科目情報検索
	 */
	stngcode.ajax.getKamokuUrl = stngcode.ajax.baseSvUrl + "KamokuJohoKensaku.aspx";

	/**
	 *試験地情報検索
	 */
	stngcode.ajax.getSikentiUrl = stngcode.ajax.baseSvUrl + "SikentiJohoKensaku.aspx";

	/**
	 *解答用紙別成績入力対象検索
	 */
	stngcode.ajax.yosiSeisekiUrl = stngcode.ajax.baseSvUrl + "YosiSeisekiNyuryokuTaisyoKensaku.aspx";

	/**
	 *全科目一覧成績入力対象検索
	 */
	stngcode.ajax.kamokuSeisekiUrl = stngcode.ajax.baseSvUrl + "ZenKamokuItiranSeisekiNyuryokuTaisyoKensaku.aspx";

	/**
	 *段階評価入力対象検索
	 */
	stngcode.ajax.hyokaSeisekiUrl = stngcode.ajax.baseSvUrl + "DankaiHyokaNyuryokuTaishoKensaku.aspx";

	/**
	 *成績入力方式チェック
	 */
	stngcode.ajax.typeSeisekiUrl = stngcode.ajax.baseSvUrl + "SeisekiNyuryokuHosikiCheck.aspx";

	/**
	 *解答用紙別成績成績登録
	 */
	stngcode.ajax.yosiSeisekiRegUrl = stngcode.ajax.baseSvUrl + "YosiSeisekiToroku.aspx";

	/**
	 *全科目一覧成績登録
	 */
	stngcode.ajax.kamokuSeisekiRegUrl = stngcode.ajax.baseSvUrl + "ZenKamokuItiranSeisekiToroku.aspx";

	/**
	 *段階評価成績登録
	 */
	stngcode.ajax.hyokaSeisekiRegUrl = stngcode.ajax.baseSvUrl + "DankaiHyokaSeisekiToroku.aspx";

	/**
	 *無成績者検索
	 */
	stngcode.ajax.muSeisekiSrchUrl = stngcode.ajax.baseSvUrl + "MuseisekiKensaku.aspx";

	/**
	 *無成績者欠席検索
	 */
	stngcode.ajax.muSeisekiRegUrl = stngcode.ajax.baseSvUrl + "MuseisekiKessekiToroku.aspx";

	/**
	 *総合点算出情報検索
	 */
	stngcode.ajax.totalScoreUrl = stngcode.ajax.baseSvUrl + "SogotenSansyutuJohoKensaku.aspx";

	/**
	 *総合点登録
	 */
	stngcode.ajax.totalScoreRegUrl = stngcode.ajax.baseSvUrl + "SogotenToroku.aspx";

	/**
	 *合否入力対象検索
	 */
	stngcode.ajax.passEntryUrl = stngcode.ajax.baseSvUrl + "GohiNyuryokuTaisyoKensaku.aspx";

	/**
	 *合否登録
	 */
	stngcode.ajax.passEntryRegUrl = stngcode.ajax.baseSvUrl + "GohiToroku.aspx";

	/**
	 *合否結果集計
	 */
	stngcode.ajax.passSummaryUrl = stngcode.ajax.baseSvUrl + "GohiKekkaSyukei.aspx";


	/**
	 *繰上合格対象検索
	 */
	stngcode.ajax.carryPassUrl = stngcode.ajax.baseSvUrl + "KuriageGokakuNyuryokuTaisyoKensaku.aspx";

	/**
	 *繰上合格登録
	 */
	stngcode.ajax.carryPassRegUrl = stngcode.ajax.baseSvUrl + "KuriageGokakuToroku.aspx";

	/**
	 *納金結果集計
	 */
	stngcode.ajax.nokinSummaryUrl = stngcode.ajax.baseSvUrl + "NokinJokyoSyukei.aspx";

	/**
	 *事務処理フェーズ登録
	 */
	stngcode.ajax.jimuPhaseRegUrl = stngcode.ajax.baseSvUrl + "JimuSyoriPhaseToroku.aspx";

	/**
	 *事務処理フェーズチェック
	 */
	stngcode.ajax.jimuPhaseChkUrl = stngcode.ajax.baseSvUrl + "JimuSyoriPhaseCheck.aspx";

	/**
	 *足切登録
	 */
	stngcode.ajax.asikiriRegUrl = stngcode.ajax.baseSvUrl + "AsikiriToroku.aspx";

	/**
	 *併願情報検索
	 */
	stngcode.ajax.heiganUrl = stngcode.ajax.baseSvUrl + "TagakkaHeiganJokyoKensaku.aspx";

	/**
	 *学納金データ出力
	 */
	stngcode.ajax.gakuExpUrl = stngcode.ajax.baseSvUrl + "GakunokinKanriRenkeiDataExport.aspx";

	/**
	 *学籍番号発行対象検索
	 */
	stngcode.ajax.gnoSrchUrl = stngcode.ajax.baseSvUrl + "GakusekiNoHakkoTaishoKensaku.aspx";

	/**
	 *学籍番号登録
	 */
	stngcode.ajax.gnoRegUrl = stngcode.ajax.baseSvUrl + "GakusekiNoToroku.aspx";

	/**
	 *汎用データ検索
	 */
	stngcode.ajax.cmnSrchUrl = stngcode.ajax.baseSvUrl + "HanyoDataKensaku.aspx";

	/**
	 *汎用データ更新
	 */
	stngcode.ajax.cmnUpdUrl = stngcode.ajax.baseSvUrl + "HanyoDataKosin.aspx";

	/**
	 *センタープラス成績検索
	 */
	stngcode.ajax.centerPlusUrl = stngcode.ajax.baseSvUrl + "CenterPlusSeisekiKensaku.aspx";

	/**
	 *合否データインポート
	 */
	stngcode.ajax.gohiImpUrl = stngcode.ajax.baseSvUrl + "GohiDataImport.aspx";


	/**
	 *メールひな形取得
	 */
	stngcode.ajax.mailTmpUrl = {
		"1":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycbxc5_dr4l2knzGRKP6oF1RTTuDcv-AkPZ7KOdWraDQ4p975tf4/exec"},
		"2":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycbxc5_dr4l2knzGRKP6oF1RTTuDcv-AkPZ7KOdWraDQ4p975tf4/exec"},
		"3":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycbxc5_dr4l2knzGRKP6oF1RTTuDcv-AkPZ7KOdWraDQ4p975tf4/exec"}
	}

	stngcode.ajax.mailTmpUpdateUrl = {
		"1":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycby4LMsycm5HA9Nh_Dbxrna3W3eoF2gNZ52sUAtbETKDiLPsemWP/exec"},
		"2":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycby4LMsycm5HA9Nh_Dbxrna3W3eoF2gNZ52sUAtbETKDiLPsemWP/exec"},
		"3":{"url":"https://script.google.com/a/macros/fit-world.jp/s/AKfycby4LMsycm5HA9Nh_Dbxrna3W3eoF2gNZ52sUAtbETKDiLPsemWP/exec"}
	}


	/**
	 *受験番号ラベル印刷
	 */
	stngcode.ajax.labelPrintExcel = stngcode.ajax.baseSvUrl + "cl/excel/受験番号ラベル印刷.xlsm";

	/**
	 *受付状況集計表
	 */
	stngcode.ajax.uketukeExcel = stngcode.ajax.baseSvUrl + "cl/excel/受付状況集計表.xlsm";

	/**
	 *成績入力点検リスト
	 */
	stngcode.ajax.sikenExcel = stngcode.ajax.baseSvUrl + "cl/excel/成績入力点検リスト.xlsm";

	/**
	 *通知書類印刷
	 */
	stngcode.ajax.tutiExcel = stngcode.ajax.baseSvUrl + "cl/excel/通知書類印刷.xlsm";

	/**
	 *合格者発表
	 */
	stngcode.ajax.gokakuListExcel = stngcode.ajax.baseSvUrl + "cl/excel/合格発表.xlsm";

	/**
	 *宛名ラベル印刷
	 */
	stngcode.ajax.atenaExcel = stngcode.ajax.baseSvUrl + "cl/excel/宛名ラベル印刷.xlsm";

	/**
	 *会場掲示物
	 */
	stngcode.ajax.kaijoKeijiExcel = stngcode.ajax.baseSvUrl + "cl/excel/会場掲示物.xlsm";

	/**
	 *採点者割当表
	 */
	stngcode.ajax.saitenWariateExcel = stngcode.ajax.baseSvUrl + "cl/excel/採点者割当表.xlsm";

	/**
	 *面接予定表
	 */
	stngcode.ajax.mensetuYoteiExcel = stngcode.ajax.baseSvUrl + "cl/excel/面接予定表.xlsm";

	/**
	 * ネット出願通知メール送信URL
	 */

	//stngcode.ajax.sendMaillUrl = "https://script.google.com/a/fujita-hu.ac.jp/macros/s/AKfycbxeW0LwqUyeBjZdhUC2E_Vm_xXuLYznHZCGzt4yF25YL0vn4oM/exec"; //TEST
	stngcode.ajax.sendMaillUrl = "https://script.google.com/a/fujita-hu.ac.jp/macros/s/AKfycbyDQk13SGpQLj54k8ovZvvfSNoz61S7rFbiSmldF6cyX6Kop5s/exec";



	/**
	 * @namespace インターネット出願に関する定義を行います。
	 */
	stngcode.inet = {};

	/**
	 * Hash作成用情報
	 */
	stngcode.inet.Email = 'a_kubota@linq-sys.jp';
	stngcode.inet.Token = 'imi6Fep3'; //ネット出願のWeb.configに合わせること
	/**
	 * ベースURL設定
	 */
	//stngcode.inet.baseSvUrl = "http://" + location.host + "/netentry/"; //TEST
	//stngcode.inet.baseUrl = "http://" + location.host + "/netentry/cl/"; //TEST

	stngcode.inet.baseSvUrl = "https://" + location.host + "/netentry/"; //本番
	stngcode.inet.baseUrl = "https://exam.fujita-hu.ac.jp/netentry/cl/"; //本番
	/**
	 * インターネット出願汎用検索
	 */
	stngcode.inet.inetHanyoUrl = stngcode.inet.baseSvUrl + "SearchGeneralPurpose.aspx";

	/**
	 * 入試管理差分情報取得
	 */
	stngcode.inet.inetDiffGetUrl = stngcode.inet.baseSvUrl + "GetNyusiKanriDifference.aspx";

	/**
	 * マイページ画面
	 */
	stngcode.inet.inetMyPageUrl = stngcode.inet.baseUrl + "ems108KojinEdit.html";


	/**
	 * @namespace メッセージに関する定義を行います。
	 */
	stngcode.msg = {};

	stngcode.msg.notFound = "対象データが見つかりません。";

	stngcode.msg.ems101prog1 = "チェック対象検索中";
	stngcode.msg.ems101prog2 = "受付状況登録中";
	stngcode.msg.ems101conf1 = "受付情報を登録します。<br><br> よろしいですか？";
	stngcode.msg.ems101end1 = "登録しました。";
	stngcode.msg.ems101conf2 = "調査書情報の出力を行います。<br><br> よろしいですか？";
	stngcode.msg.ems101conf3 = "受験番号発行済みです。<br><br> よろしいですか？";

	stngcode.msg.ems102prog1 = "発行対象検索中";
	stngcode.msg.ems102prog2 = "受験番号発行中";
	stngcode.msg.ems102conf = "対象件数は {0}件です。<br><br> よろしいですか？";
	stngcode.msg.ems102end = "受験番号の発行処理が正常に終了しました。<br><br>「対象者リスト出力」ボタンをクリックすると、採番された受験番号とともに処理対象者のリストをCSVファイルで出力します。";

	stngcode.msg.ems103prog = "インターネット出願データ登録中";
	stngcode.msg.ems103conf = "インターネット出願データを登録します。<br><br>よろしいですか？";
	stngcode.msg.ems103end = "件のデータを登録しました";
	stngcode.msg.ems103error = "対象データが見つかりませんでした";

	stngcode.msg.ems104prog1 = "出力対象データ検索中";
	stngcode.msg.ems104prog2 = "受験番号登録中";
	stngcode.msg.ems104conf = "受験番号登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems104end = "件のデータを登録しました";

	stngcode.msg.ems107prog1 = "出力対象データ検索中";
	stngcode.msg.ems107prog2 = "受付情報登録中";
	stngcode.msg.ems107conf = "受付情報更新を行います。<br><br>よろしいですか？";
	stngcode.msg.ems107end = "件のデータを登録しました";

	stngcode.msg.ems108prog1 = "出願データ検索中";
	stngcode.msg.ems108prog2 = "出願データ更新中";
	stngcode.msg.ems108end = "メール送信完了しました";

	stngcode.msg.ems201prog = "座席割当処理中";
	stngcode.msg.ems201conf = "座席割当を行います。<br><br>よろしいですか？";
	stngcode.msg.ems201end = "座席割当が正常に終了しました。";

	stngcode.msg.ems301prog = "成績データ入力中";
	stngcode.msg.ems301conf = "成績データ一括登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems301end = "件のデータをインポートしました";

	stngcode.msg.ems302prog1 = "科目情報検索中";
	stngcode.msg.ems302prog2 = "成績データ検索中";
	stngcode.msg.ems302prog3 = "成績データ登録中";
	stngcode.msg.ems302conf = "成績データの登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems302end = "成績データを登録しました";

	stngcode.msg.ems303prog1 = "欠席対象検索中";
	stngcode.msg.ems303prog2 = "欠席情報登録中";
	stngcode.msg.ems303conf = "対象件数は {0}件です。<br><br> よろしいですか？";
	stngcode.msg.ems303end = "無成績者欠席登録が正常に終了しました。";

	stngcode.msg.ems304prog1 = "対象検索中";
	stngcode.msg.ems304prog2 = "総合点登録中";
	stngcode.msg.ems304conf = "対象件数は {0}件です。<br><br> よろしいですか？";
	stngcode.msg.ems304end = "総合点登録が正常に終了しました。";

	stngcode.msg.ems306prog1 = "対象検索中";
	stngcode.msg.ems306prog2 = "足切り登録中";
	stngcode.msg.ems306conf = "足切り登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems306end = "足切り登録が正常に終了しました。";

	stngcode.msg.ems307prog = "欠席データ入力中";
	stngcode.msg.ems307conf = "欠席データ一括登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems307end = "件のデータをインポートしました";

	stngcode.msg.ems401prog1 = "合否データ検索中";
	stngcode.msg.ems401prog2 = "合否データ登録中";
	stngcode.msg.ems401conf = "合否データの登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems401end = "合否データを登録しました";
	stngcode.msg.ems401error1 = "2次合否判定が実施済みです";
	stngcode.msg.ems401error2 = "合否判定確定済みです";
	stngcode.msg.ems401error3 = "現在の事務処理フェーズでは実施できません";
	stngcode.msg.ems401error4 = "一次合否判定確定済みです";

	stngcode.msg.ems402prog1 = "繰上合格データ検索中";
	stngcode.msg.ems402prog2 = "繰上合格データ登録中";
	stngcode.msg.ems402conf = "繰上合格データの登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems402end = "繰上合格データを登録しました";
	stngcode.msg.ems402error = "保留の場合は備考を入力してください";

	stngcode.msg.ems403prog = "出力対象データ検索中";
	stngcode.msg.ems403conf = "学納金データ出力を行います。<br><br>よろしいですか？";

	stngcode.msg.ems404prog1 = "発行対象検索中";
	stngcode.msg.ems404prog2 = "学籍番号登録中";
	stngcode.msg.ems404conf = "対象件数は {0}件です。<br><br> よろしいですか？";
	stngcode.msg.ems404end = "学籍番号の発行処理が正常に終了しました。";
	stngcode.msg.ems404error = "「入学者確定」処理が行われていません。";

	stngcode.msg.ems406prog = "合否データ入力中";
	stngcode.msg.ems406conf = "合否データ一括登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems406end = "件のデータをインポートしました";

	stngcode.msg.ems500prog1 = "受験生詳細情報検索中";
	stngcode.msg.ems500prog2 = "受験生情報変更中";
	stngcode.msg.ems500conf1 = "受験生情報を変更します。<br><br>よろしいですか?";
	stngcode.msg.ems500end1  = "受験生情報を変更しました。";
	stngcode.msg.ems500conf2 = "出願をキャンセルします。<br><br>よろしいですか?";
	stngcode.msg.ems500end2  = "出願をキャンセルしました。";
	stngcode.msg.ems500conf3 = "発行された受験番号をキャンセルします。<br><br>よろしいですか?";
	stngcode.msg.ems500end3  = "受験番号をキャンセルしました。";
	stngcode.msg.ems500conf4 = "自動座席割振を無効にします。<br><br>よろしいですか?";
	stngcode.msg.ems500end4  = "自動座席割振を無効にしました。";
	stngcode.msg.ems500conf5 = "調査書情報を登録します。<br><br>よろしいですか?";
	stngcode.msg.ems500end5  = "調査書情報を登録しました。";

	stngcode.msg.ems501prog1 = "受験生情報検索中";
	stngcode.msg.ems501prog2 = "追加情報インポート中";
	stngcode.msg.ems501conf = "一括登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems501end = "件のデータをインポートしました";

	stngcode.msg.ems502prog1 = "受験生情報検索中";
	stngcode.msg.ems502prog2 = "メールひな形取得中";
	stngcode.msg.ems502prog3 = "送信メール登録中";
	stngcode.msg.ems502prog4 = "テンプレート更新中";
	stngcode.msg.ems502conf = "一斉メール送信登録を行います。<br><br>よろしいですか？";
	stngcode.msg.ems502end = "一斉メール情報を登録しました。";
	stngcode.msg.ems502error1 = "タイトルを入力してください。";
	stngcode.msg.ems502error2 = "メッセージを入力してください。";

	stngcode.msg.ems503prog = "メール送信履歴検索中";

	stngcode.msg.ems504prog = "併願情報検索中";

	stngcode.msg.ems601prog = "パスワード変更中";
	stngcode.msg.ems601conf = "パスワードを変更しました";

	stngcode.msg.ems602prog1 = "メール承認情報取得中";
	stngcode.msg.ems602prog2 = "メール承認情報登録中";
	stngcode.msg.ems602conf1 = "メール送信を承認します。<br><br>よろしいですか？";
	stngcode.msg.ems602conf2 = "メール送信を否認します。<br><br>よろしいですか？";
	stngcode.msg.ems602end = "メール承認情報を登録しました。";
	stngcode.msg.ems602error = "対象を選択してください。";

	stngcode.msg.ems603prog = "業務フェーズ確定処理中";
	stngcode.msg.ems603conf1 = "選択された業務フェーズを確定します。<br><br> よろしいですか？";
	stngcode.msg.ems603end1 = "業務フェーズを確定しました。";
	stngcode.msg.ems603conf2 = "１つ前の業務フェーズに戻します。<br><br> よろしいですか？";
	stngcode.msg.ems603end2 = "業務フェーズを１つ前の業務に戻しました。";
	stngcode.msg.ems603error = "次のフェーズ以外には進めません。";

	stngcode.msg.ems604prog = "マスターデータ登録中";
	stngcode.msg.ems604conf = "マスターデータを登録します。<br><br>よろしいですか？";
	stngcode.msg.ems604end = "マスターが正常に終了しました。";


}) ();
