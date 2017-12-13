/**
 * @fileOverview 共通イベントコンロトール
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		//
		//無操作タイムアウト設定
		//
		function timer_func(){
			location.href = stngcode.loginUrl;
		}
		var time_limit=10*60*1000; //制限時間
		var timer_id=setTimeout(timer_func, time_limit);
		
		$(document).on('keydown mousedown scroll',function(){
			clearTimeout(timer_id);
			timer_id=setTimeout(timer_func, time_limit);
		});

		
	});
	
})();

