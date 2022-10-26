const express = require("express");

/* 使用・関連モジュール(app.js) */
// express-session

module.exports = function () {
	var router = express.Router();
	router.all("/*", function (req, res, next) {
		// console.log("■ login-check.js：ログインセッションのチェック");

		// if (false) {
		if (!req.session.login && process.env.DEBUG == "debug") {
			req.session.login = {
				id: 0,
				login_id: "開発用ログインID",
				name: "開発用ログイン"
			};
			console.log('\u001b[31m！注意！ログインセッションが機能していない状態です\u001b[0m');
		}
		/* この行をコメント化切り替えでアクセス全スルー
		req.session.login = { login_id: "開発用ログインが有効です", name: "担当のエンジニアに報告してください" };
		console.log('\u001b[31m！注意！ログインセッションが機能していない状態です\u001b[0m');
		// */

		if (req.session.login) {
			// ログイン済みの場合はスルー
			next();
		} else {
			// 未ログインの場合はリダイレクト
			res.redirect("/admin/login/");
		}
	});
	return router;
};