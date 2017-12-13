/** 
* @fileOverview UTFからSJISへの変換
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
	Utf2Sjis = function()
	{
	};
	
	
	/**
	 *
     * 文字列から，Unicodeコードポイントの配列を作る
	 * @param 対象文字列
	 * @return 配列
     */
	Utf2Sjis.str_to_unicode_array = function(str)
	{
		var arr = [];
		for( var i = 0; i < str.length; i ++ ){
			arr.push( str.charCodeAt( i ) );
		}
		return arr;
	};	
	
	/**
	 *
     * UTF文字列からSJIS変換されたBlobを作成
	 * @param 対象文字列
	 * @return blob
     */
	Utf2Sjis.convert = function(str)
	{
		// Unicodeコードポイントの配列に変換する
		var unicode_array = Utf2Sjis.str_to_unicode_array( str );
		
		// SJISコードポイントの配列に変換
		var sjis_code_array = Encoding.convert( 
		unicode_array, // ※文字列を直接渡すのではない点に注意
			'SJIS',  // to
			'UNICODE' // from
		);
		
		// 文字コード配列をTypedArrayに変換する
		var uint8_array = new Uint8Array( sjis_code_array );
		
		// 指定されたデータを保持するBlobを作成する
		var blob = new Blob([ uint8_array ], { type: 'text/csv' });
		
		return blob;
	};	
	
	
})();
