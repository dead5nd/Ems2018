/**
 * @fileOverview jQuery Validator Add CustomCheck
 * @author FiT
 * @version 1.0.0
 */

(function()
{
	$(document).ready(function()
	{
		// 英数字混在のチェック
		$.validator.addMethod("alfaNumeric", function(value, element){
		  return this.optional(element) || /([0-9].*[a-zA-Z]|[a-zA-Z].*[0-9])/.test(value);
		 }, "英数字混在で入力してください。");
		

	});
	
})();

