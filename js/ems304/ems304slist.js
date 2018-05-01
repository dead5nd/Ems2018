/**
* @fileOverview 成績情報クラス
* @author FiT
* @version 1.0.0
*/

(function()
{
	/**
	 *
	 * コンストラクタ
	 *
	 */
	Slist = function()
	{
	};

	/**
	 *
     * 初期設定
	 *
     */
	Slist.init = function(list)
	{
		Slist.gakubu_cd = Login.gakubuCd;
		Slist.siken_cd = $("#siken_cd").val();
		Slist.gakka_cd = $("#gakka_cd").val();
		Slist.ji_kubun = $("#12ji_kubun").val();

		Slist.data = [];
		for (var i = 0; i < list.length; i++) {
			Slist.data[i] = {};
			Slist.data[i]['juken_no'] = list[i]['juken_no'];
			Slist.data[i]['sch_cd'] = list[i]['sch_cd'];
			Slist.data[i]['sch_rank'] = list[i]['sch_rank'];
			Slist.data[i]['kokusai_menjo'] = list[i]['kokusai_menjo'];
			Slist.data[i]['kekkaku_cd'] = list[i]['kekkaku_cd'];
			Slist.data[i]['chosa'] = ('chosa' in list[i]) ? list[i]['chosa'] : '';
			Slist.data[i]['k_list'] = ('k_list' in list[i]) ? list[i]['k_list'] : [];
			Slist.data[i]['q_list'] = ('q_list' in list[i]) ? list[i]['q_list'] : [];
			// 総合点の初期値を0とする
			Slist.data[i]['score'] = 0;
			Slist.data[i]['aj_score'] = 0;
		}
	};

	/**
	 *
     * 総合点計算処理分岐
	 *
     */
	Slist.totalScore = function()
	{
		var SUISEN = '1';
		var AO = 'O';
		var IPAN_ZENKI = '2';
		var IPAN_KOKI = '3';
		var CENTER_ZENKI = '4';
		var CENTER_KOKI = '5';
		var ASSEMBLY = 'A';
		var CENTER_PLUS = 'P';
		var JIKO = 'N';
		var SITEIKO = 'D';

		if (Slist.gakubu_cd == '1') { // 医学部
			switch (Slist.siken_cd) {
				case SUISEN:
				case AO:
				case IPAN_ZENKI:
				case IPAN_KOKI:
					Slist.IgakuBase();
					break;

				case CENTER_ZENKI:
					//2018年度はセンター後期と同じなので
					//Slist.IgakuCenterZenki();
					Slist.IgakuCenterKoki();
					break;

				case CENTER_KOKI:
					Slist.IgakuCenterKoki();
					break;

				default:
					break;
			}
		} else if (Slist.gakubu_cd == '2') { // 医療科学部
			switch (Slist.siken_cd) {
				case SUISEN:
					Slist.IkaSuisen();
					break;
				case JIKO:
					Slist.IkaSuisenJiko();
					break;
				case SITEIKO:
					Slist.IkaSuisenSiteiko();
					break;

				case IPAN_ZENKI:
				case IPAN_KOKI:
					Slist.IkaIpan();
					break;

				case CENTER_ZENKI:
				case CENTER_KOKI:
					Slist.IkaCenter();
					break;

				case ASSEMBLY:
					Slist.IkaAssembly();
					break;

				case CENTER_PLUS:
					Slist.IkaCenterPlus();
					break;

				default:
					break;
			}

		} else if (Slist.gakubu_cd == '3') { // 看護専門学校
			switch (Slist.siken_cd) {
				case SUISEN:
				case IPAN_ZENKI:
			    case SITEIKO:
					Slist.KangoBase();
					break;

				default:
					break;
			}

		}

	};

	//---------------------------------------------------------------------
	//
	// 医学部 総合点計算
	//
	//---------------------------------------------------------------------
	/**
	 *
 	 * 各科目の素点をそのまま集計
	 *
     */
	Slist.IgakuBase = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var total_score = 0;
			var tmpnum;

			for (var j = 0; j < Slist.data[i].k_list.length; j++) {

				tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
				total_score = total_score + tmpnum;
			}
			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = 0; //未使用とする
		}
	};
	/**
	 *
 	 * センター前期の換算配点
	 *
     */
	Slist.IgakuCenterZenki = function()
	{
		//1次試験
		if (Slist.ji_kubun == '1') {
			for (var i = 0; i < Slist.data.length; i++) {
				var total_score = 0;
				var tmpnum;
				var kokugo = 0;
				var eigo = 0;
				var sugaku = 0;
				var rika = 0;

				for (var j = 0; j < Slist.data[i].k_list.length; j++) {
					tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
					switch (Slist.data[i].k_list[j].kamoku_cd) {
						case 'A2': //国語(現代文）
							kokugo = kokugo + tmpnum;
							break;

						case 'J1': //英語
						case 'K1': //リスニング
							eigo = eigo + tmpnum;
							break;

						case 'D2': //数学Ⅰ・数学A
						case 'E2': //数学Ⅱ・数学B
							sugaku = sugaku + tmpnum;
							break;

						case 'G1': //物理
						case 'G2': //化学
						case 'G3': //生物
							rika = rika + tmpnum;
							break;
					}
				}
				total_score = kokugo + ( eigo * (200/250) ) + sugaku + rika;

				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = 0; //未使用とする
			}
		//2次試験
		} else {
			for (var i = 0; i < Slist.data.length; i++) {
				var total_score = 0;
				var tmpnum;

				for (var j = 0; j < Slist.data[i].k_list.length; j++) {

					tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
					total_score = total_score + tmpnum;
				}
				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = 0; //未使用とする
			}
		}
	};

	/**
	 *
 	 * センター後期の換算配点
	 *
     */
	Slist.IgakuCenterKoki = function()
	{
		//1次試験
		if (Slist.ji_kubun == '1') {
			for (var i = 0; i < Slist.data.length; i++) {
				var total_score = 0;
				var tmpnum;
				var kokugo = 0;
				var eigo = 0;
				var sugaku = 0;
				var rika = 0;
				var tiri = 0;

				for (var j = 0; j < Slist.data[i].k_list.length; j++) {
					tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
					switch (Slist.data[i].k_list[j].kamoku_cd) {
						case 'A1': //国語(全体）
							kokugo = kokugo + tmpnum;
							break;

						case 'J1': //英語
						case 'K1': //リスニング
							eigo = eigo + tmpnum;
							break;

						case 'D2': //数学Ⅰ・数学A
						case 'E2': //数学Ⅱ・数学B
							sugaku = sugaku + tmpnum;
							break;

						case 'G1': //物理
						case 'G2': //化学
						case 'G3': //生物
							rika = rika + tmpnum;
							break;

						case 'B1': //世界史A
						case 'B2': //世界史B
						case 'B3': //日本史A
						case 'B4': //日本史B
						case 'B5': //地理A
						case 'B6': //地理B
						case 'C1': //現代社会
						case 'C2': //倫理
						case 'C3': //政治・経済
						case 'C4': //倫理、政治・経済
							tiri = tiri + tmpnum;
							break;
					}
				}
				//2018年度は配点変更
				//total_score = kokugo + ( eigo * (200/250) ) + sugaku + rika + tiri;
				total_score = ( kokugo * (100/200) ) + eigo + ( sugaku * (250/200) ) + ( rika * (250/200) ) + ( tiri * (50/100) );

				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = 0; //未使用とする
			}
		//2次試験
		} else {
			for (var i = 0; i < Slist.data.length; i++) {
				var total_score = 0;
				var tmpnum;

				for (var j = 0; j < Slist.data[i].k_list.length; j++) {

					tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
					total_score = total_score + tmpnum;
				}
				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = 0; //未使用とする
			}
		}
	};

	//---------------------------------------------------------------------
	//
	// 看護専門学校 総合点計算
	//
	//---------------------------------------------------------------------
	/**
	 *
     * 看護専門
	 * 各科目の素点をそのまま集計
	 *
     */
	Slist.KangoBase = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var total_score = 0;
			var tmpnum;

			for (var j = 0; j < Slist.data[i].k_list.length; j++) {

				tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
				total_score = total_score + tmpnum;
			}
			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = 0; //未使用とする
		}
	};
	//---------------------------------------------------------------------
	//
	// 医療科学部 総合点計算
	//
	//---------------------------------------------------------------------
	/**
	 *
 	 * 推薦の換算配点
	 *
     */
	Slist.IkaSuisen = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var mu_sikaku = false;
			var yobi_mu_sikaku = true;
			var total_score = 0;
			var score_org = 0; //広報統計用の100点換算前成績
			var tmpnum;
			var obj = Slist.data[i].chosa;
			var hyotei = Slist.chosaData(obj, '評定平均');
			var keseki = Slist.chosaData(obj, '欠席日数');
			var rank = (Slist.data[i].sch_rank == '') ? 1 : Number( Slist.data[i].sch_rank );

			//調査書評点
			var chosa = (hyotei * 10) * (1 - (rank - 1) * 0.02);

			//高校生活状況
			var seikatu = 0;
			if (keseki == 0) {
				seikatu = 5;
			} else if (keseki <= 3) {
				seikatu = 3;
			} else {
				seikatu = 0;
			}
			//<<2017.10.1 ハイフン等文字が入っていたら評価しない
			if (isNaN( Number(obj['欠席日数']) )) {
				seikatu = 0;
			}


			//小論文と面接の成績
			var ronbun = 0;
			var mensetu = 0;

			for (var j = 0; j < Slist.data[i].q_list.length; j++) {
				tmpnum = Slist.data[i].q_list[j].score == ""  ? 0 : Number( Slist.data[i].q_list[j].score );
				switch (Slist.data[i].q_list[j].kamoku_cd) {
					case 'L1': //小論文
						score_org = score_org + tmpnum;
						if (Slist.data[i].q_list[j].setumon_no == '01') {
							ronbun = ronbun + (tmpnum * 0.3);
						} else {
							ronbun = ronbun + (tmpnum * 0.15);
						}
						break;
						//得点0点は無資格
						if (tmpnum == 0) {
							mu_sikaku = true;
						}
					case 'M1': //面接
						score_org = score_org + tmpnum;
						mensetu = mensetu + tmpnum;
						//無資格チェック
						if (tmpnum == 1) {	//一人でも1なら無資格
							mu_sikaku = true;
						}
						if (tmpnum > 2) { 	//全員でも2かどうかをチェック
							yobi_mu_sikaku = false;
						}

						break;

				}
			}

			total_score = chosa + seikatu + ronbun + mensetu;

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = score_org; //学科分

			//無資格のチェック
			if ( (mu_sikaku) || (yobi_mu_sikaku) ) {
				Slist.data[i]['kekkaku_cd'] = '4'; //無資格
			} else {
				if (Slist.data[i]['kekkaku_cd'] == '4') {
					Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
				}

			}
		}
	};
	/**
	 *
 	 * 推薦(指定校）の換算配点
	 *
     */
	Slist.IkaSuisenSiteiko = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var total_score = 0;
			var tmpnum;
			var obj = Slist.data[i].chosa;
			var hyotei = Slist.chosaData(obj, '評定平均');
			var keseki = Slist.chosaData(obj, '欠席日数');
			var rank = (Slist.data[i].sch_rank == '') ? 1 : Number( Slist.data[i].sch_rank );

			//調査書評点
			var chosa = (hyotei * 10) * (1 - (rank - 1) * 0.02);

			//高校生活状況
			var seikatu = 0;
			if (keseki == 0) {
				seikatu = 5;
			} else if (keseki <= 3) {
				seikatu = 3;
			} else {
				seikatu = 0;
			}
			//<<2017.10.1 ハイフン等文字が入っていたら評価しない
			if (isNaN( Number(obj['欠席日数']) )) {
				seikatu = 0;
			}

			//面接の成績
			var mensetu = 0;

			for (var j = 0; j < Slist.data[i].q_list.length; j++) {
				tmpnum = Slist.data[i].q_list[j].score == ""  ? 0 : Number( Slist.data[i].q_list[j].score );
				switch (Slist.data[i].q_list[j].kamoku_cd) {
					case 'M1': //面接
						mensetu = mensetu + tmpnum;

						break;

				}
			}

			total_score = chosa + seikatu + (mensetu * 3);

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = (mensetu * 3); //面接分
			//Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
		}
	};
 	/**
	 *
 	 * 推薦(社会人自己推薦）の換算配点
	 *
     */
	Slist.IkaSuisenJiko = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {

			var total_score = 0;
			var tmpnum;

			//小論文と面接の成績
			var ronbun = 0;
			var mensetu = 0;

			for (var j = 0; j < Slist.data[i].q_list.length; j++) {
				tmpnum = Slist.data[i].q_list[j].score == ""  ? 0 : Number( Slist.data[i].q_list[j].score );
				switch (Slist.data[i].q_list[j].kamoku_cd) {
					case 'L1': //小論文
						ronbun = ronbun + tmpnum;
						break;

					case 'M1': //面接
						mensetu = mensetu + tmpnum;
						break;

				}
			}

			total_score =( ronbun * 0.5 ) + ( ( mensetu * 10 ) / 3);

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = total_score; //
			//Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
		}
	};
	/**
	 *
	 * アセンブリ入試
	 *
     */
	Slist.IkaAssembly = function()
	{
		//1次試験
		if (Slist.ji_kubun == '1') {

			for (var i = 0; i < Slist.data.length; i++) {
				var mu_sikaku = false;
				var yobi_mu_sikaku = true;
				var total_score = 0;
				var tmpnum;
				var obj = Slist.data[i].chosa;
				var hyotei = Slist.chosaData(obj, '評定平均');
				var keseki = Slist.chosaData(obj, '欠席日数');
				var rank = (Slist.data[i].sch_rank == '') ? 1 : Number( Slist.data[i].sch_rank );

				//調査書評点
				var chosa = (hyotei * 3) * (1 - (rank - 1) * 0.02);

				//高校生活状況
				var seikatu = 0;
				if (keseki == 0) {
					seikatu = 5;
				} else if (keseki <= 3) {
					seikatu = 3;
				} else {
					seikatu = 0;
				}
				//<<2017.10.1 ハイフン等文字が入っていたら評価しない
				if (isNaN( Number(obj['欠席日数']) )) {
					seikatu = 0;
				}

				//選択していない科目は0点なので、高成績から選択する必要は無いが
				//高成績から選択の例として実装する
				var eigo = 0;
				var buturi = 0;
				var kagaku = 0;
				var seibutu = 0;
				var active = 0;

				//国際適正免除ONの場合英語は満点とする
				if (Slist.data[i].kokusai_menjo == '1') {
					eigo = 40;
				}
				for (var j = 0; j < Slist.data[i].k_list.length; j++) {
					tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
					switch (Slist.data[i].k_list[j].kamoku_cd) {
						case 'J1': //国際適正検査
							if (Slist.data[i].kokusai_menjo == '1') {
								eigo = 40;
							} else {
								eigo = eigo + (tmpnum * (40 / 100));
							}
							break;

						case 'F1': //物理基礎
							buturi = buturi + tmpnum;
							break;

						case 'F2': //化学基礎
							kagaku = kagaku + tmpnum;
							break;

						case 'F3': //生物基礎
							seibutu = seibutu + tmpnum;
							break;

						case 'N1': //アクティブレポート
							active = active + (tmpnum * (20 / 100));
							break;

					}
				}
				// rika の計算
				var datas = [];
				datas[0] = buturi;
				datas[1] = kagaku;
				datas[2] = seibutu;
				switch (Slist.gakka_cd) {
					case '3':
					case '4':
					case '5':
						rika = Slist.selectScore(datas, 2) * (20 / 200);
						break;

					case '1':
					case '2':
					case '7':
					case '6':
						rika = Slist.selectScore(datas, 1) * (20 / 100);
						break;

					default:
						rika = 0;
						break;
				}

				var total_score = eigo  + rika + active + chosa + seikatu;
				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = eigo  + rika + active; //

				//無資格のチェック
				if ( ( eigo == 0) || (rika == 0) || (active == 0) ) {
					Slist.data[i]['kekkaku_cd'] = '4'; //無資格
				} else {
					if (Slist.data[i]['kekkaku_cd'] == '4') {
						Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
					}

				}
			}
		//2次試験
		} else {
			for (var i = 0; i < Slist.data.length; i++) {
				var mu_sikaku = false;
				var yobi_mu_sikaku = (Slist.data[i].q_list.length > 0) ? true : false; //成績データなしは判定しない
				var total_score = 0;
				var gd = 0;
				var tmpnum;

				for (var j = 0; j < Slist.data[i].q_list.length; j++) {
					tmpnum = Slist.data[i].q_list[j].score == ""  ? 0 : Number( Slist.data[i].q_list[j].score );
					switch (Slist.data[i].q_list[j].kamoku_cd) {
						case 'M3': //グループディスカッション
							gd = gd + tmpnum;
							//無資格チェック
							if (tmpnum == 1) {	//一人でも1なら無資格
								mu_sikaku = true;
							}
							if (tmpnum > 2) { 	//全員でも2かどうかをチェック
								yobi_mu_sikaku = false;
							}
							break;

					}
				}

				var total_score = gd * 10;
				Slist.data[i]['score'] = total_score;
				Slist.data[i]['aj_score'] = 0; //未使用とする

				//無資格のチェック
				if ( (mu_sikaku) || (yobi_mu_sikaku) ) {
					Slist.data[i]['kekkaku_cd'] = '4'; //無資格
				} else {
					if (Slist.data[i]['kekkaku_cd'] == '4') {
						Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
					}
				}
			}


		}

	};

	/**
	 *
 	 * 一般入試の換算配点
	 *
     */
	Slist.IkaIpan = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var mu_sikaku = false;
			var yobi_mu_sikaku = true;
			var total_score = 0;
			var tmpnum;
			var obj = Slist.data[i].chosa;
			var hyotei = Slist.chosaData(obj, '評定平均');
			var keseki = Slist.chosaData(obj, '欠席日数');

			//var rank = (Slist.data[i].sch_rank == '') ? 1 : Number( Slist.data[i].sch_rank );

			//調査書評点
			//var chosa = (hyotei * 10) * (1 - (rank - 1) * 0.02);
			var chosa = hyotei;

			//高等学校卒業程度認定試験合格者は生活状況評価しない
			var seikatu = 0;
			if (Slist.data[i].sch_cd == '51000K') {
				seikatu = 0;
			} else {
				//高校生活状況
				if (keseki == 0) {
					seikatu = 3;
				} else if (keseki <= 3) {
					seikatu = 2;
				} else if (keseki <= 6) {
					seikatu = 1;
				} else {
					seikatu = 0;
				}

			}
			//<<2017.10.1 ハイフン等文字が入っていたら評価しない
			if (isNaN( Number(obj['欠席日数']) )) {
				seikatu = 0;
			}

			//学科試験の成績
			var gakka = 0;
			var gakka_org = 0;　//成績統計用の100点換算前学科成績
			var eigo = 0;
			var datas = [];
			var min_score = 0;
			var rika_cnt = 0; //理科2科目選択による無資格チェックのため

			for (var j = 0; j < Slist.data[i].k_list.length; j++) {
				tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
				switch (Slist.data[i].k_list[j].kamoku_cd) {
					case 'J1': //外国語
						eigo = eigo + tmpnum;
						break;

					case 'F1': //物理
					case 'F2': //化学
					case 'F3': //生物
						if (tmpnum > 0) {
							rika_cnt = rika_cnt + 1;
						}
						gakka = gakka + tmpnum;
						break;

					default:
						gakka = gakka + tmpnum;
						break;
				}
				datas[j] = tmpnum; //無資格チェック用に保存
			}

			switch (Slist.gakka_cd) {
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
					gakka_org = eigo + gakka;
					gakka = (eigo + gakka)  * (92 / 300);
					min_score = Slist.selectMinScore(datas, 3);
					break;

				case '7':
					gakka = Slist.selectScore(datas, 2)  *  (92 / 200); //全体の上位2つを利用する
					gakka_org = Slist.selectScore(datas, 2);
					min_score = Slist.selectMinScore(datas, 2);
					break;

				default:
					gakka = 0;
					break;
			}
			total_score = chosa + seikatu + gakka;
			//ToDo
			//total_score = Math.round(total_score * 100) / 100;

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = gakka_org;

			//無資格のチェック 選択科目に0点があった場合
			//理科(基礎）を2科目選択した場合も無資格
			if ( (min_score == 0) || (rika_cnt > 1) ) {
				Slist.data[i]['kekkaku_cd'] = '4'; //無資格
			} else {
				if (Slist.data[i]['kekkaku_cd'] == '4') {
					Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
				}
			}
		}
	};

	/**
	 *
 	 * センター入試の換算配点
	 *
     */
	Slist.IkaCenter = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var total_score = 0;
			var tmpnum;

			//学科試験の成績
			var score_J1K1 = 0;
			var score_D2 = 0;
			var score_E2 = 0;
			var score_F123 = 0;
			var score_G123 = 0;
			var score_G1 = 0;
			var score_G2 = 0;
			var score_G3 = 0;
			var score_A2 = 0;

			var datas = [];
			var datasFsel = [];
			var datasGsel = [];
			var min_score = 0;
			var score = 0;
			var score_org = 0; //広報統計用の100点換算前成績

			for (var j = 0; j < Slist.data[i].k_list.length; j++) {
				tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
				switch (Slist.data[i].k_list[j].kamoku_cd) {
					case 'J1': //英語
					case 'K1': //リスニング
						score_J1K1 = score_J1K1 + tmpnum;
						break;

					case 'A2': //国語
						score_A2 = score_A2 + tmpnum;
						break;

					case 'D2': //数学ⅠA
						score_D2 = score_D2 + tmpnum;
						break;

					case 'E2': //数学ⅡB
						score_E2 = score_E2 + tmpnum;
						break;

					case 'F1': //物理基礎
					case 'F2': //化学基礎
					case 'F3': //生物基礎
						datasFsel.push(tmpnum);
						break;

					case 'G1': //物理
						score_G1 = score_G1 + tmpnum;
						datasGsel.push(tmpnum);
						break;

					case 'G2': //化学
						score_G2 = score_G2 + tmpnum;
						datasGsel.push(tmpnum);
						break

					case 'G3': //生物
						score_G3 = score_G3 + tmpnum;
						datasGsel.push(tmpnum);
						break;
				}
			}

			switch (Slist.gakka_cd) {
				case '1':
					score_J1K1 = score_J1K1 * (100 / 250);
					score_F123 = Slist.selectScore(datasFsel, 2);
					datas[0] = score_D2;
					datas[1] = score_E2;
					datas[2] = score_F123;
					datas[3] = score_G1;
					datas[4] = score_G2;
					datas[5] = score_G3;
					score = (score_J1K1 + Slist.selectScore(datas, 3)) * (1 / 4);
					score_org = score_J1K1 + Slist.selectScore(datas, 3);
					//無資格チェックのため
					datas[6] = score_J1K1;
					min_score = Slist.selectMinScore(datas, 4);
					break;

				case '2':
				case '4':
				case '5':
					score_J1K1 = score_J1K1 * (100 / 250);
					score_F123 = Slist.selectScore(datasFsel, 2);
					score_G123 = Slist.selectScore(datasGsel, 1);
					datas[0] = score_A2;
					datas[1] = score_D2;
					datas[2] = score_E2;
					datas[3] = score_F123;
					//<<2017.7.21 理科は個別に扱う(昨年データとの整合のため)
					//2018.01.27　1科目のみ選択とする
					datas[4] = score_G123;
					/*
					datas[4] = score_G1;
					datas[5] = score_G2;
					datas[6] = score_G3;
					*/
					score = (score_J1K1 + Slist.selectScore(datas, 2)) * (1 / 3);
					score_org = score_J1K1 + Slist.selectScore(datas, 2);
					//無資格チェックのため
					datas.push(score_J1K1);
					min_score = Slist.selectMinScore(datas, 3);
					break;

				case '3':
				case '6':
					score_J1K1 = score_J1K1 * (200 / 250);
					var rika1 = Slist.selectScore(datasFsel, 2) + Slist.selectScore(datasGsel, 1);
					var rika2 = Slist.selectScore(datasGsel, 2);
					var rika = (rika1 > rika2) ? rika1 : rika2;
					score = (score_J1K1 + score_D2 + score_E2 + rika) * (1 / 6);
					score_org = score_J1K1 + score_D2 + score_E2 + rika;
					//無資格チェックのため
					datas[0] = score_J1K1;
					datas[1] = score_D2;
					datas[2] = score_E2;
					if (rika1 > rika2) {
						datas[3] = Slist.selectMinScore(datasFsel, 2);
						datas[4] = Slist.selectScore(datasGsel, 1);
						min_score = Slist.selectMinScore(datas, 5);
					} else {
						datas[3] = Slist.selectMinScore(datasGsel, 2);
						min_score = Slist.selectMinScore(datas, 4);
					}
					break;

				case '7':
					score_J1K1 = score_J1K1 * (100 / 250);
					score_F123 = Slist.selectScore(datasFsel, 2);
					score_G123 = Slist.selectScore(datasGsel, 1);
					datas[0] = score_J1K1;
					datas[1] = score_A2;
					datas[2] = score_D2;
					datas[3] = score_E2;
					datas[4] = score_F123;
					//<<2017.7.21 理科は個別に扱う
					//2018.01.27 1科目のみ選択とする
					datas[5] = score_G123;
					/*
					datas[5] = score_G1;
					datas[6] = score_G2;
					datas[7] = score_G3;
					*/
					score = Slist.selectScore(datas, 2) * (1 / 2);
					score_org = Slist.selectScore(datas, 2);
					//無資格チェックのため
					min_score = Slist.selectMinScore(datas, 2);
					break;

				default:
					gakka = 0;
					break;
			}
			total_score = score;

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = score_org;

			//無資格のチェック 選択科目に0点があった場合
			if (min_score == 0) {
				Slist.data[i]['kekkaku_cd'] = '4'; //無資格
			} else {
				if (Slist.data[i]['kekkaku_cd'] == '4') {
					Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
				}

			}
		}
	};

 	 /**
	 *
 	 * センタープラスの換算配点
	 *
     */
	Slist.IkaCenterPlus = function()
	{
		for (var i = 0; i < Slist.data.length; i++) {
			var mu_sikaku = false;
			var yobi_mu_sikaku = true;
			var total_score = 0;
			var tmpnum;

			//学科試験の成績
			var gakka = 0;
			var gakka_org = 0; //広報統計用の100点換算前学科成績
			var datas = [];
			var min_score = 0;

			for (var j = 0; j < Slist.data[i].k_list.length; j++) {
				tmpnum = Slist.kamokuScore( Slist.data[i].k_list[j] );
				gakka = gakka + tmpnum;
				datas[j] = tmpnum; //無資格チェック用に保存
			}

			switch (Slist.gakka_cd) {
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
					gakka_org = gakka;
					gakka = gakka * (1 / 4);
					min_score = Slist.selectMinScore(datas, 2);
					break;

				case '7':
					gakka_org = gakka;
					gakka = gakka * (1 / 2);
					min_score = Slist.selectMinScore(datas, 1);
					break;

				default:
					gakka = 0;
					break;
			}
			total_score = gakka;

			Slist.data[i]['score'] = total_score;
			Slist.data[i]['aj_score'] = gakka_org;

			//無資格のチェック 選択科目に0点があった場合
			if (min_score == 0) {
				Slist.data[i]['kekkaku_cd'] = '4'; //無資格
			} else {
				if (Slist.data[i]['kekkaku_cd'] == '4') {
					Slist.data[i]['kekkaku_cd'] = '0'; //欠格でない
				}

			}
		}
	};
	/**
	 *
     * 科目別情報からスコアの取得
	 *
     */
	Slist.kamokuScore = function(obj)
	{
		var score;
		switch (obj.kamoku_cd) {
			//以下の科目は得点化しない(面接チェックカウント）
			case 'M5':
			case 'M6':
			case 'M7':
			case 'M8':
			case 'M9':
				score = 0;
				break;

			default:
				//調整値が設定されていたら、そちらを使う
				if ( obj.aj_score  != "" ) {
					if ( Number( obj.aj_score ) > 0 ) {
						score = Number( obj.aj_score );
					} else {
						score = obj.t_score == "" ? 0 : Number( obj.t_score );
					}
				} else {
					score = obj.t_score == "" ? 0 : Number( obj.t_score );
				}
				break;
		}
		return score;

	};

	/**
	 *
     * 選択科目成績リストから指定された高得点分を加算
	 * @param datas 成績配列
	 * @param num 抽出件数
	 * @return 加算結果
     */
	Slist.selectScore = function(datas, num)
	{
		var score = 0;

		//最初に降順ソートする
		datas.sort(function(a,b){
	        if( a > b ) return -1;
	        if( a < b ) return 1;
	        return 0;
		});

		//高成績分を加算する
		for (var i = 0; i < datas.length; i++) {
			if (i < num) {
				score = score + datas[i];
			}
		}

		return score;

	};

	/**
	 *
     * 選択科目成績リストから指定された最小得点を取得
	 * @param datas 成績配列
	 * @param num 抽出件数
	 * @return 最小得点
     */
	Slist.selectMinScore = function(datas, num)
	{
		var score = 0;

		//最初に降順ソートする
		datas.sort(function(a,b){
	        if( a > b ) return -1;
	        if( a < b ) return 1;
	        return 0;
		});

		//指定件数内での最小得点を取得する
		if (datas.length >= num) {
			score = datas[num-1];
		} else {
			score = 0;
		}

		return score;

	};

	/**
	 *
     * 調査書情報の取得
	 *
     */
	Slist.chosaData = function(obj, key)
	{
		var data;

		if (key in obj) {
			//<<2017/4/1
			//data = (obj[key] == '') ? 0 : Number( obj[key] );
			data = Number( obj[key]);
			if (isNaN(data)) {
				data = 0;
			}
			//>>
		} else {
			data = 0;
		}
		return data;

	};

	/**
	 *
	 * 総合点登録用
     * サーバ送信JSON文字列作成
	 *
     */
	Slist.sendData = function()
	{
		var data = [];
		var j = 0;
		for (i=0; i < Slist.data.length; i++) {
			data[j] = {};
			data[j]['juken_no'] = cmncode.jnoToFull( Slist.data[i]['juken_no'] );
			data[j]['gakka_cd'] = Slist.gakka_cd;
			data[j]['12ji_kubun'] = Slist.ji_kubun;
			data[j]['score'] = Slist.data[i]['score'];
			data[j]['aj_score'] = Slist.data[i]['aj_score'];
			data[j]['kekkaku_cd'] = (Slist.data[i]['kekkaku_cd'] == '') ? '0' : Slist.data[i]['kekkaku_cd'] ;
			j++;
		}
		return JSON.stringify(data);
	};

	/**
	 *
     * 確認メッセージの組み立て
	 *
     */
	Slist.setConfMessage = function()
	{
		// 対象件数算出
		var result = stngcode.msg.ems304conf.replace( '{0}', Slist.data.length);
		return result
	};

})();
