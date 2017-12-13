/** 
 * @fileOverview 共通で使用される機能を定義します
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	 * @namespace 共通で使用される部品を定義します。
	 */
	cmncode = {};

	/**
	 * クラスの継承機能を提供します。
	 * 
	 * @param {Object}		derive		継承先インスタンス
	 * @param {Object}		base		継承元クラス名
	 * @param {Object[]}	baseArgs	継承元クラス
	 */
	cmncode.initializeBase = function (derive, base, baseArgs)
	{
		base.apply(derive, baseArgs);
		var proto = derive.constructor.prototype;
		for (prop in base.prototype)
		{
			if (!proto[prop])
				proto[prop] = base.prototype[prop];
		}
	};
	/**
	 * 実施年度の年度数字取得
	 * 
	 * @return 実施年度の数字
	 *
	 */	
	cmncode.getNendo = function ()
	{
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth()+1;
		if (month >=1 && month <=3) {
			nendo = year;
		} else {
			nendo = year + 1;
		}
		return String(nendo);
		
		/*
		// 過去年度動作モードになっている場合にはそれに従う
		if (stngcode.sysNendo == 0) {
			return nendo;
		} else {
			return stngcode.sysNendo;
		}*/
		
		
	};

	/**
	 * 英数字を全角→半角変換する
	 * 
	 * @param  {String} str	対象文字
	 * @return {String} 変換後文字
	 *
	 */	
	cmncode.strToHalf = function (str)
	{
		var retStr;
		
		retStr = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});
		
		return retStr;
	};
	
	/**
	 * カタカナを全角→半角変換する
	 * 
	 * @param  {String} str	対象文字
	 * @return {String} 変換後文字
	 *
	 */	
	cmncode.kanaToHalf = function (str)
	{
		var befkana = new Array("ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ",
								"サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト",
								"ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
								"マ","ミ","ム","メ","モ","ヤ","ユ","ヨ",
								"ラ","リ","ル","レ","ロ","ワ","ヲ","ン",
								"―","ー","－","‐");
		var befdaku = new Array("ヴ","ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ",
								"ダ","ヂ","ヅ","デ","ド",
								"バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ");
		var befsoku = new Array("ァ","ィ","ゥ","ェ","ォ","ッ","ャ","ュ","ョ");
		var aftkana = new Array("ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ",
								"ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ",
								"ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ",
								"ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ",
								"ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ",
								"-","-","-","-");
		var aftdaku = new Array("ｳﾞ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｻﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ",
								"ﾀﾞ","ﾁﾞ","ﾂﾞ","ﾃﾞ","ﾄﾞ",
								"ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ");
		var aftsoku = new Array("ｱ","ｲ","ｳ","ｴ","ｵ","ﾂ","ﾔ","ﾕ","ﾖ");
 		var bef = befkana;
 		var aft = aftkana;
		
		for (i = 0; i < aftdaku.length; i++) {
			reg = new RegExp(befdaku[i],"g");
			str = str.replace(reg, aftdaku[i]);
		}
 		for (i = 0; i < aft.length; i++) {
 			reg = new RegExp(bef[i],"g");
 			str = str.replace(reg, aft[i]);
 		}
 		for (i = 0; i < aftsoku.length; i++) {
 			reg = new RegExp(befsoku[i],"g");
 			str = str.replace(reg, aftsoku[i]);
 		}
 		
		return str;
	};
	
	/**
	 * URLデコード処理
	 * 
	 * @param  {String} encodeURI	エンコードされたURI
	 * @return {String} デコードされたURI
	 *
	 */	
	cmncode.decodeURI = function (encodeURI)
	{
		try {
			return decodeURI(encodeURI);
			
		} catch(error) {
			return '???';
		}
		
	};
	
	/**
	 *
	 * yyyy/mm/dd形式での本日日付取得
	 * 
	 */	
	cmncode.getToday = function ()
	{
		var p = function(num) {
    		return ((num + "").length == 1) ? "0" + num : num;
  		}
		var now = new Date();
		return now.getFullYear() + '/' + p(now.getMonth()+1) + '/' +p(now.getDate());
	};
	/**
	 *
	 * 現在日時の取得 yyyymmddhhmmss
	 * 
	 */	
	cmncode.getTimeStr = function ()
	{
		var today = new Date();
	  
		var year = today.getFullYear().toString();
		var month = ("0" + (today.getMonth() + 1)).slice(-2);
		var day = ("0" + today.getDate()).slice(-2);
		
		var hh = ("0" + today.getHours()).slice(-2);
		var mm = ("0" + today.getMinutes()).slice(-2);
		var ss = ("0" + today.getSeconds()).slice(-2);
		
		var hiduke = year + month + day;
		var jikoku = hh + mm + ss;
		var resp = hiduke + jikoku;
		
		return resp;
	};
	
	/**
	 *
	 * 現在日時の取得 yyyy/mm/dd hh:mm:ss
	 * 
	 */	
	cmncode.getTime = function ()
	{
		var today = new Date();
	  
		var year = today.getFullYear().toString();
		var month = ("0" + (today.getMonth() + 1)).slice(-2);
		var day = ("0" + today.getDate()).slice(-2);
		
		var hh = ("0" + today.getHours()).slice(-2);
		var mm = ("0" + today.getMinutes()).slice(-2);
		var ss = ("0" + today.getSeconds()).slice(-2);
		
		var hiduke = year + "/" + month + "/" + day;
		var jikoku = hh + ":" + mm + ":" + ss;
		var resp = hiduke + " " + jikoku;
		
		return resp;
	};
	/**
	 *
	 * 日付の編集 dd/mm/yyyy ⇒ yyyy/mm/dd
	 * @parameter i_str 変換前文字
	 * @return 変換後文字
	 */	
	cmncode.mdy2ymd = function (i_str)
	{
		var resp = '';
		var tmp = i_str.split(' '); //空白除く
		var str = tmp[0];
		
		if (str) {
			var datas = str.split('/');
			var d0 = ("0" + datas[0]).slice(-2); //day
			var d1 = ("0" + datas[1]).slice(-2); //month
			var d2 = datas[2]; //year
			
			if (d0.length < d2.length) {
				//入替する
				resp = d2+ '/' + d0 + '/' + d1;
			} else {
				//何もしないでそのまま返す
				resp = str;
				
			}
		}
		return resp;
	};
	/**
	 *
	 * 日付の編集 yyyy/mm ⇒ yyyy/mm/01
	 * @parameter i_str 変換前文字
	 * @return 変換後文字
	 */	
	cmncode.ym2ymd = function (i_str)
	{
		var resp = '';
		
		if (i_str) {
			if (i_str.length < 8) {
				resp = i_str + '/01'
			} else {
				//何もしないでそのまま返す
				resp = i_str;
				
			}
		}
		return resp;
	};
	/**
	 *
	 * 数字文字列をカンマ編集する
	 *
	 */	
	cmncode.toComma = function (num)
	{
		var resp = num.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') + '円';
		//var resp = num.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
		
		return resp;
	};
	
	/**
	 *
     * 認証用ハッシュ文字列取得
	 * @parameter email メールアドレス
	 * @parameter reqdate リクエスト日時
	 * @parameter token 認証用トークン
     * @return hash
	 *
     */
	cmncode.getLoginHash = function(email, reqdate, token)
	{
		
		var str_key = token + reqdate + email;
		
		var shaObj = new jsSHA("SHA-256", "TEXT");
		shaObj.update(str_key);
		var hash = shaObj.getHash("HEX");
		
		return hash;
		
	};	
	
	/**
	 *
	 * datepicker初期処理呼び出し
	 * 
	 */	
	cmncode.datepickerInit = function ()
	{
		// 本日日付をセットする
		$("#jissibi").val( cmncode.getToday );
		
		// datepicker処理
		$('.datepicker').datepicker({
	        format: 'yyyy/mm/dd',
	        language: 'ja',
			autoclose: true
		 });
		
		
		
		
	};	
	
	/**
	 *
	 * DataTable初期処理呼び出し
	 * 
	 */	
	cmncode.dataTablesInit = function (sort_enable, opt_sort_col)
	{
		
		var col = opt_sort_col === undefined ? 0 : opt_sort_col;
		$('#page01Table').DataTable({
			searching: false,
			sort: sort_enable,
			fixedHeader: true,
			scrollY: 530,
			order:[[col,'asc']],
			displayLength: 50, 
			language: {
				url: stngcode.dataTableJpnUrl
			} 
		});
		
		
	};	
	
	/**
	 *
	 * 受験番号の学部別処理（６桁にする）
	 * 医療科学部は６桁運用
	 */	
	cmncode.jnoToFull = function (short_jno)
	{
		var full_jno = short_jno;

		if (short_jno.length == 4) {
			if (Login.gakubuCd == stngcode.IGAKU) { //医学部
				full_jno = '11' + short_jno;
			}
			if (Login.gakubuCd == stngcode.KANSEN) { //看護専門学校
				full_jno = '50' + short_jno;
			}
		}
		
		return full_jno;
	};	
	
	/**
	 *
	 * 受験番号の学部別処理(運用桁にする）
	 * 医療科学部は６桁運用
	 */	
	cmncode.jnoToShort = function (full_jno)
	{
		var short_jno = full_jno;

		if (short_jno.length == 6) {
			if (Login.gakubuCd == stngcode.IGAKU) { //医学部
				short_jno = full_jno.substring(2,6);
			}
			if (Login.gakubuCd == stngcode.KANSEN) { //看護専門学校
				short_jno = full_jno.substring(2,6);
			}
		}
		
		return short_jno;
	};
	 	
	 /**
	 *
	 * 整理番号11桁を9桁にする
	 *
	 */	
	cmncode.seiriToShort = function (full_seiri_no)
	{
		var short_seiri_no = full_seiri_no;

		if (short_seiri_no.length == 11) {
			short_seiri_no = full_seiri_no.substring(0,9);
		}
		
		return short_seiri_no;
	};		
	
	/**
	 *
	 * 受験番号の先頭２桁取得
	 * 
	 */	
	cmncode.getJnoTop2 = function ()
	{
		var top2;
		if (Login.gakubuCd == stngcode.IGAKU) { //医学部
			top2 = '11';
		} else if (Login.gakubuCd == stngcode.IRYOKAGAKU) { //医療科学部
			top2 = '20';
		} else if (Login.gakubuCd == stngcode.KANSEN) { //看護専門学校
			top2 = '50';
		}
		
		return top2;
	};	
	 	
	/**
	 *
	 * 試験区分による1次、2次選択の有無
	 * @param siken_cd 試験区分コード
	 * 
	 */	
	cmncode.check2ji = function (siken_cd)
	{
		var ret;
		if (Login.gakubuCd == stngcode.IGAKU) { //医学部
			ret = true;
		} else if (Login.gakubuCd == stngcode.IRYOKAGAKU) { //医療科学部
			if (siken_cd == 'A') {
				ret = true;
			} else {
				ret = false;
			}
		} else if (Login.gakubuCd == stngcode.KANSEN) { //看護専門学校
			ret = false;
		}
		
		return ret;
	};	
	/**
	 *
	 * 試験区分による1次、2次試験地の判断
	 * @param siken_cd 試験区分コード
	 * 
	 */	
	cmncode.sikenti2ji = function (siken_cd)
	{
		var ret = false;
		if (Login.gakubuCd == stngcode.IGAKU) { //医学部
			if (siken_cd = '5') { //センター後期
				ret = true;
			}
		} 
		
		return ret;
	};	
	/**
	 *
	 * 試験区分による地域枠、一般枠選択の有無
	 * @param siken_cd 試験区分コード
	 * 
	 */	
	cmncode.checkWaku = function (siken_cd)
	{
		var ret;
		if (Login.gakubuCd == stngcode.IGAKU) { //医学部
			if (siken_cd == '2') { //一般入試
				ret = true;
			} else {
				ret = false;
			}
		} else if (Login.gakubuCd == stngcode.IRYOKAGAKU) { //医療科学部
			ret = false;
		} else if (Login.gakubuCd == stngcode.KANSEN) { //看護専門学校
			ret = false;
		}
		
		return ret;
	};	

	 /**
	 *
	 * 配列内のscoreを小数点以下無の表記に変更
	 * @param list[] 対象が格納されたオブジェクト配列
	 * @return 編集後
	 * 
	 */	
	cmncode.scoreToInt = function (list)
	{
		var score;
		
		for (var i = 0; i < list.length; i++) {
			if ('ms_score' in list[i]) {
				score = cmncode.floatToInt(list[i]['ms_score']);
				list[i]['ms_score'] = score;
			}
			if ('score' in list[i]) {
				score = cmncode.floatToInt(list[i]['score']);
				list[i]['score'] = score;
			}
			if ('total_score' in list[i]) {
				score = cmncode.floatToInt(list[i]['total_score']);
				list[i]['total_score'] = score;
			}
		}
		
		return list;
	};	
	 	
	/**
	 *
	 * 小数点以下無の表記に変更
	 * @param floatVal 小数点付文字列
	 * @return 編集後
	 * 
	 */	
	cmncode.floatToInt = function (floatVal)
	{
		var ret;
		ret = floatVal.replace(/\.?0+$/, "");
		
		return ret;
	};	
	 	
	 /**
	 *
	 * 配列内のms_scoreをscoreに入れる(センター試験成績表示のため）
	 * @param list[] 対象が格納されたオブジェクト配列
	 * @return 編集後
	 * 
	 */	
	cmncode.changeScore = function (list)
	{
		for (var i = 0; i < list.length; i++) {
			if ('ms_score' in list[i]) {
				list[i]['score'] = list[i]['ms_score'];
				list[i]['ms_score'] = '';
			}
		}
		
		return list;
	};	
	 	
	/**
	 * @namespace JQuery Templateによる要素のレンダリング機能を提供します。
	 */
	cmncode.template = {};

	/**
	 * 指定されたDOMに対してテンプレートデータを挿入する際に使用します。
	 * @param {String} tmpltId テンプレートID
	 * @param {Object} datas バインディングに使用するデータ
	 * @param {String} dstId エレメント挿入先ID
	 */
	cmncode.template.bind = function(tmpltId, datas, dstId, options)
	{
		if(dstId.indexOf("#", 0) != 0)
			dstId = "#" + dstId;

		if(tmpltId.indexOf("#", 0) != 0)
			tmpltId = "#" + tmpltId;

		$(dstId + " *").remove();
		$(tmpltId).tmpl(datas, options).appendTo(dstId);
		/*
		if($(dstId).attr("data-role") != null && $(dstId).attr("data-role").toLowerCase() == "listview")
		{
			$(dstId).listview("refresh");
			$(dstId).trigger("create");
		}
		else if($(dstId)[0].nodeName.toLocaleLowerCase() == "select")
			$(dstId).selectmenu("refresh");
		else
			$(dstId).trigger("create");
		*/
	};

	/**
	* @namespace ダイアログメッセージ表示機能を提供します。
	*/
	cmncode.dlg = {};

	/**
	* 処理中メッセージ画面表示
	* @param {String} message 処理中メッセージ
	*/
	cmncode.dlg.showLoading = function (message)
	{
		$.blockUI({ 
			message: '<img src="./img/loading.gif" />　' + message ,
			css: { 
			border: 'none', 
			'-webkit-border-radius': '10px', 
			'-moz-border-radius': '10px', 
			padding: '20px'}
		});
	};

	/**
	* 処理中メッセージ画面消去
	*/
	cmncode.dlg.hideLoading = function ()
	{
		$.unblockUI();
	};
	
	/**
	* メッセージ画面処理(画面遷移なし）
	* @param {String} title タイトル
	* @param {String} message エラーメッセージ
	*/
	cmncode.dlg.alertMessage = function (title, message)
	{
		var msgAfter = message.replace(/Error:/g, '');
		document.getElementById("alertModalTitle").innerHTML = title;
		document.getElementById("alertModalMessage").innerHTML = msgAfter;
		$("#alertModal").modal(
			{
				backdrop: "static"
			}
		);
	};
	
	/**
	* メッセージ画面処理(OK時にコールバック）
	* @param {String} title タイトル
	* @param {String} message エラーメッセージ
	* @param {Object} callBack 	コールバック
	*/
	cmncode.dlg.alertMessageCB = function (title, message, callBack)
	{
		var msgAfter = message.replace(/Error:/g, '');
		document.getElementById("alertModalTitleCB").innerHTML = title;
		document.getElementById("alertModalMessageCB").innerHTML = msgAfter;
		$("#alertModalCB").on('show.bs.modal', function (event) {
				
			$("#alertModalOK").unbind('click'); 
			$("#alertModalOK").bind('click', function (event)
			{
				$("#alertModalCB").modal('hide');
				callBack();
				
			});
		});
		$("#alertModalCB").modal(
			{
				backdrop: "static"
			}
		);
	};
		
	/**
	* 確認画面処理(OK時にコールバック）
	* @param {String} title タイトル
	* @param {String} btnTitleL ボタン文言左
	* @param {String} btnTitleR ボタン文言右
	* @param {String} message 	エラーメッセージ
	* @param {Object} callBack 	コールバック
	*/
	cmncode.dlg.confMessage = function (title, btnTitleL, btnTitleR, message,  callBack)
	{
		var msgAfter = message.replace(/Error:/g, '');
		document.getElementById("confModalTitle").innerHTML = title;
		document.getElementById("confModalButtonL").innerHTML = btnTitleL;
		document.getElementById("confModalButtonR").innerHTML = btnTitleR;
		document.getElementById("confModalMessage").innerHTML = msgAfter;

		$("#confModal").on('show.bs.modal', function (event) {
				
			$("#confModalOK").unbind('click'); 
			$("#confModalOK").bind('click', function (event)
			{
				$("#confModal").modal('hide');
				callBack();
				
			});
		});
		$("#confModal").modal(
			{
				backdrop: "static"
			}
		);
	};

	/**
	* 確認画面処理(OK時とNG時にコールバック）
	* @param {String} title タイトル
	* @param {String} btnTitleL ボタン文言左
	* @param {String} btnTitleR ボタン文言右
	* @param {String} message 	エラーメッセージ
	* @param {Object} callBackOK 	OKコールバック
	* @param {Object} callBackNG 	NGコールバック
	*/
	cmncode.dlg.confMessageCB = function (title, btnTitleL, btnTitleR, message,  callBackOK, callBackNG)
	{
		var msgAfter = message.replace(/Error:/g, '');
		document.getElementById("confModalTitleCB").innerHTML = title;
		document.getElementById("confModalButtonLCB").innerHTML = btnTitleL;
		document.getElementById("confModalButtonRCB").innerHTML = btnTitleR;
		document.getElementById("confModalMessageCB").innerHTML = msgAfter;

		$("#confModalCB").on('show.bs.modal', function (event) {
				
			$("#confModalOKCB").unbind('click'); 
			$("#confModalOKCB").bind('click', function (event)
			{
				$("#confModalCB").modal('hide');
				callBackOK();
				
			});

			$("#confModalNGCB").unbind('click'); 
			$("#confModalNGCB").bind('click', function (event)
			{
				$("#confModalCB").modal('hide');
				callBackNG();
				
			});
		});
		$("#confModalCB").modal(
			{
				backdrop: "static"
			}
		);
	};
		
	/**
	* エクスポート確認画面処理(OK時とNG時にコールバック）
	* @param {String} title タイトル
	* @param {String} btnTitleL ボタン文言左
	* @param {String} btnTitleR ボタン文言右
	* @param {String} message 	エラーメッセージ
	* @param {Object} callBackOK 	OKコールバック
	* @param {Object} callBackNG 	NGコールバック
	*/
	cmncode.dlg.confMessageCB2 = function (title, btnTitleL, btnTitleR, message,  callBackOK, callBackNG)
	{
		var msgAfter = message.replace(/Error:/g, '');
		document.getElementById("confModalTitleCB2").innerHTML = title;
		document.getElementById("confModalButtonLCB2").innerHTML = btnTitleL;
		document.getElementById("confModalButtonRCB2").innerHTML = btnTitleR;
		document.getElementById("confModalMessageCB2").innerHTML = msgAfter;

		$("#confModalCB2").on('show.bs.modal', function (event) {
				
			$("#confModalOKCB2").unbind('click'); 
			$("#confModalOKCB2").bind('click', function (event)
			{
				$("#confModalCB2").modal('hide');
				callBackOK();
				
			});

			$("#confModalNGCB2").unbind('click'); 
			$("#confModalNGCB2").bind('click', function (event)
			{
				$("#confModalCB2").modal('hide');
				callBackNG();
				
			});
		});
		$("#confModalCB2").modal(
			{
				backdrop: "static"
			}
		);
	};
		
})();

