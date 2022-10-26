/* チェックボックスでテーブルの表示列を制御 */
/* cookieName, defaultState */
var cookie
$(window).on("load", function () {
	var reg = new RegExp(`${cookieName}=\\[.*\\]`)
	cookie = document.cookie.match(reg);

	if (!cookie) { //クッキーが存在しないとき、デフォルト値を設定
		document.cookie = `${cookieName}=${defaultState}`;
		cookie = document.cookie.match(reg);
	}
	cookie = cookie[0].match(/\[.*\]/)[0]
	cookie = cookie.slice(1, -1).split(",");

	for (var i in cookie) {
		if (cookie[i] == 1) change_checkbox_state(i)
		else display_column(i)
	}
})

var $checkbox = $(".row_display-checkbox")
$checkbox.on("click", function () {
	var index = $checkbox.index(this); // クリックした箇所が何番目か
	display_column(index)

	var isChecked = $(this).prop("checked");
	cookie[index] = isChecked ? 1 : 0
	saveCookie(cookie)
})

/* チェックボックスのチェック状態を切り替え */
function change_checkbox_state(i, bool = true) {
	$checkbox.eq(i).prop('checked', bool)
}

//テーブルの縦1列全てを表示・非表示切り替え
function display_column(i) {
	var table = document.getElementsByTagName("table")[0];
	var cell = document.getElementsByTagName("th")[i];
	// var cell = document.getElementsByClassName("tableHeader")[i];
	var isChecked = $checkbox.eq(i).prop('checked')

	for (var i = 0; table.rows[i]; i++) {
		table.rows[i].cells[cell.cellIndex].style.display = (isChecked) ? '' : 'none';
	}
}

/* クッキーを保存 */
function saveCookie(cookie) {
	var str = "[" + cookie.join(",") + "]"
	document.cookie = `${cookieName}=${str}`;
}

/* チェックボックスを初期状態に */
$(".row_display-delete").on("click", function () {
	cookie = defaultState.slice(1, -1).split(",");

	for (var i in cookie) {
		if (cookie[i] == 1) bool = true
		else bool = false

		change_checkbox_state(i, bool)
		display_column(i)
	}
	saveCookie(cookie)
})
/* チェックボックスを全てON */
$(".row_display-all").on("click", function () {
	cookie = defaultState.slice(1, -1).split(",");
	for (const i in cookie) {
		cookie[i] = 1
	}

	for (var i in cookie) {
		change_checkbox_state(i, true)
		display_column(i)
	}
	saveCookie(cookie)
})
/* クッキー全削除
var cookiesArray = document.cookie.split(';');
for (var c of cookiesArray) {   //配列の要素を変数cに入れて繰り返す
	var cArray = c.split('=');
	document.cookie = cArray[0] + '=;max-age=0' //有効期限=0 に
}	// */