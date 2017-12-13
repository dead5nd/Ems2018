// 初期化処理
(function($) {
  "use strict";
  // Validatorの初期値を変更します
  $.validator.setDefaults({
    // NG項目のclass
    errorClass : 'has-error',
    // OK項目のclass
    validClass : 'has-success',
    // 入力チェックNGの場合、項目のform-groupにerrorClassを設定します
    highlight : function(element, errorClass, validClass) {
      $(element).closest('.form-group').addClass(errorClass);
    },
    // 入力チェックOKの場合、項目のform-groupにvalidClassを設定します
    unhighlight : function(element, errorClass, validClass) {
      $(element).closest('.form-group').removeClass(errorClass);
    }
  });
}(jQuery));

// DOM構築後の処理
$(function() {
  "use strict";
  $('form').each(function(index, element) {
    var $form = $(element);
    //var validator = $form.validate();

    // フォームがresetされたときの処理
    $form.bind('reset', function() {
      // Validatorをリセットします
      //validator.resetForm();
      // フォーム内のすべてのform-groupからerrorClassとvalidClassを削除します
      $form.find('.form-group').each(function(index, element) {
        $(element).removeClass($.validator.defaults.errorClass);
      });
    });
  });
});

