//add.ejs や edit.ejs などで使用する
window.addEventListener("DOMContentLoaded", () => {
	/* css5 クラスの各子要素に、必須入力表示用のクラスを付与する */
	$(".css5").children().addClass("form-wrap")
	$(".form-wrap > span:first-child").addClass("form-title")
	/* 必須入力の表示 */
	// var $required = $("input[required], select[required]").closest(".form-wrap").find(".form-title");
	var $required = $("input[required], select[required]").closest("td");
	// var $required = $("input[required], select[required]").parent()
	// $required.prepend("<span style='color: red;'>※必須入力※　</span>");
	$required.append("<span style='color: red; margin: auto 5px'>※必須</span>");
	$required.css({ "background-color": "" });

	/* 数字を最大9桁に */
	$("input[type='number']").on('input', function () {
		this.value = this.value.slice(0, 9);
	})
});