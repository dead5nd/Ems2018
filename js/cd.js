﻿/**
 * @fileOverview MENU設定値を定義します
 * @author FiT
 * @version 1.0.0
 */

(function ()
{
	/**
	 * @namespace 設定値を定義します。
	 */
	cd = {};

	cd.siken = {
		1:[
			{ cd: "1", name:"推薦入学試験"},
			{ cd: "O", name:"ＡＯ入学試験(ふじた未来枠)"},
			{ cd: "2", name:"一般入学試験((前期)愛知県地域枠含む)"},
			{ cd: "3", name:"一般入学試験(後期)"},
			{ cd: "4", name:"センター試験利用入試(前期)"},
			{ cd: "5", name:"センター試験利用入試(後期)"}
		],
		2:[
			{ cd: "1", name:"推薦入学試験＜一般公募制推薦＞"},
			{ cd: "N", name:"推薦入学試験＜看護学科　社会人自己推薦＞"},
			{ cd: "D", name:"推薦入学試験＜看護学科　指定校推薦＞"},
			{ cd: "A", name:"アセンブリ入学試験"},
			{ cd: "2", name:"一般前期入学試験"},
			{ cd: "4", name:"センター試験利用前期入学試験"},
			{ cd: "P", name:"センタープラス入学試験"},
			{ cd: "3", name:"一般後期入学試験"},
			{ cd: "5", name:"センター試験利用後期入学試験"}
		],
		3:[
			{ cd: "1", name:"推薦入学試験"},
			{ cd: "D", name:"推薦入学試験＜指定校推薦＞"},
			{ cd: "2", name:"一般入学試験"}
		]
	};

	//コードから名前変換用
	cd.sikennm_cd = {
		"11": "推薦入学試験" ,
		"1O": "ＡＯ入学試験(ふじた未来枠)" ,
		"12": "一般入学試験((前期)愛知県地域枠含む)" ,
		"13": "一般入学試験(後期)" ,
		"14": "センター試験利用入試(前期)" ,
		"15": "センター試験利用入試(後期)" ,
		"21": "推薦入学試験＜一般公募制推薦＞" ,
		"2N": "推薦入学試験＜看護学科 社会人自己推薦＞" ,
		"2D": "推薦入学試験＜看護学科 指定校推薦＞" ,
		"2A": "アセンブリ入学試験" ,
		"22": "一般前期入学試験" ,
		"24": "センター試験利用前期入学試験" ,
		"23": "一般後期入学試験" ,
		"25": "センター試験利用後期入学試験" ,
		"2P": "センタープラス入学試験" ,
		"31": "推薦入学試験" ,
		"3D": "推薦入学試験＜指定校推薦＞" ,
		"32": "一般入学試験"
	};

	cd.gakka = {
		1:[
			{ cd: "M", name:"医学科"}
		],
		2:[
			{ cd: "1", name:"臨床検査学科"},
			{ cd: "2", name:"看護学科"},
			{ cd: "3", name:"放射線学科"},
			{ cd: "4", name:"リハビリテーション学科　理学療法専攻"},
			{ cd: "5", name:"リハビリテーション学科　作業療法専攻"},
			{ cd: "6", name:"臨床工学科"},
			{ cd: "7", name:"医療経営情報学科"}
		],
		3:[
			{ cd: "N", name:"医療専門課程　看護科"}
		]
	};
	//コードから名前変換用
	cd.gakubunm_cd = {
		"1": "医学部",
		"2": "医療科学部" ,
		"3": "看護専門学校" ,
	};
	//コードから名前変換用
	cd.gakkanm_cd = {
		"M": "医学科",
		"N": "看護専門学校" ,
		"1": "臨床検査学科" ,
		"2": "看護学科" ,
		"3": "放射線学科" ,
		"4": "理学療法専攻" ,
		"5": "作業療法専攻" ,
		"6": "臨床工学科" ,
		"7": "医療経営情報学科"
	};
	//コードから名前変換用
	cd.nyukinnm_cd = {
		"0": "未入金",
		"1": "入金済" ,
		"2": "キャンセル" ,
	};

	cd.kaijo = {
		1:[
			{ cd: "H", name:"本　学"},
			{ cd: "N", name:"名古屋"},
			{ cd: "T", name:"東　京 "},
			{ cd: "O", name:"大　阪"},
			{ cd: "D", name:"センター "}
		],
		2:[
			{ cd: "H", name:"本学"},
			{ cd: "N", name:"名古屋 "},
			{ cd: "T", name:"東京 "},
			{ cd: "K", name:"金沢"},
			{ cd: "S", name:"浜松 "},
			{ cd: "Y", name:"四日市 "},
			{ cd: "O", name:"大阪 "},
			{ cd: "D", name:"センター"},
			{ cd: "P", name:"センター本学 "}
		],
		3:[
			{ cd: "H", name:"本校"}
		]
	};

	cd.kaijo2 = {
		1:[
			{ cd: "H", name:"本　学"}
		],
		2:[
			{ cd: "H", name:"本学"}

		],
		3:[
			{ cd: "H", name:"本校"}
		]
	};

	cd.uketuke = [
			{ cd: "0", name:"書類未着"},
			{ cd: "1", name:"書類OK"},
			{ cd: "2", name:"書類不備"},
			{ cd: "3", name:"出願キャンセル"},
			{ cd: "4", name:"学籍書類OK"}
	];

	cd.gohi = [
			{ cd: "0", name:"未判定"},
			{ cd: "1", name:"欠席"},
			{ cd: "2", name:"不合格"},
			{ cd: "3", name:"(1次合格）"},
			{ cd: "4", name:"補欠"},
			{ cd: "5", name:"特待合格"},
			{ cd: "6", name:"正規合格"},
			{ cd: "7", name:"繰上合格"},
			{ cd: "8", name:"追加合格"}
	];

	cd.nokin = [
			{ cd: "0", name:"未入金"},
			{ cd: "1", name:"合格辞退"},
			{ cd: "2", name:"(入学金約束）"},
			{ cd: "3", name:"入学金納入"},
			{ cd: "4", name:"(辞退連絡）"},
			{ cd: "5", name:"入学辞退"},
			{ cd: "6", name:"(学納金約束）"},
			{ cd: "7", name:"学納金納入"},
			{ cd: "9", name:"(保留）"}
	];

	cd.step = [
			{ cd: "1", name:"受付"},
			{ cd: "2", name:"受験番号確定"},
			{ cd: "3", name:"合否確定"},
			{ cd: "4", name:"入学者確定"},
			{ cd: "5", name:"１次合否確定"}
	];

	cd.kekkaku =
			{ "0":"",
			  "1":"面接失格",
			  "2":"二次欠席",
			  "3":"書類不備",
			  "4":"無資格"
			};

	cd.sikenNm =
			{ "1":"推薦入試",
			  "2":"一般前期",
			  "3":"一般後期",
			  "4":"センター前期",
			  "5":"センター後期",
			  "A":"アセンブリ",
			  "P":"センタープラス",
			  "N":"社会人自己推薦",
			  "D":"指定校推薦",
			  "O":"ＡＯ入試"
			};

	cd.gakkaNm =
			{ "M":"医学科",
			  "N":"看専 看護科",
			  "1":"臨床検査学科",
			  "2":"看護学科",
			  "3":"放射線学科",
			  "4":"リハビリテーション学科 理学療法",
			  "5":"リハビリテーション学科 作業療法",
			  "6":"臨床工学科",
			  "7":"医療経営情報学科"
			};

	cd.nokinNm =
			{ "0":"未入金",
			  "1":"合格辞退",
			  "2":"(入学金約束）",
			  "3":"入学金納入",
			  "4":"(辞退連絡）",
			  "5":"入学辞退",
			  "6":"(学納金約束）",
			  "7":"学納金納入",
			  "9":"(保留）"
			};

	cd.gohiNm =
			{ "0":"未判定",
			  "1":"欠席",
			  "2":"不合格",
			  "3":"(1次合格）",
			  "4":"補欠",
			  "5":"特待合格",
			  "6":"正規合格",
			  "7":"繰上合格",
			  "8":"追加合格"
			};

	//
	// 学事システムとのコード変換
	//
	cd.gakuji_gakka =
			{ "M":"51" ,
			  "1":"41" ,
			  "2":"42" ,
			  "3":"43" ,
			  "4":"44" ,
			  "5":"45" ,
			  "6":"46" ,
			  "7":"47" ,
			  "N":"13"
			};
	cd.gakuji_seibetu =
			{ "1":"01" ,
			  "2":"02"
			};

	cd.gakuji_syugakunen =
			{ "M":"6" ,
			  "1":"4" ,
			  "2":"4" ,
			  "3":"4" ,
			  "4":"4" ,
			  "5":"4" ,
			  "6":"4" ,
			  "7":"4" ,
			  "N":"3"
			};

	cd.gakuji_siken =
			{ "1":"01",
			  "2":"03",
			  "3":"04",
			  "4":"15",
			  "5":"16",
			  "A":"34",
			  "P":"35",
			  "N":"10",
			  "D":"09"
			};

	//
	//受付状況コード
	//
	cd.uketukeOK = '1';
	cd.uketukeNG = '2';


}) ();
