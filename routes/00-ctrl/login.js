const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', (req, res, next) => {     //　/manage/login
	var pageName = `ログイン`
	console.log("----", pageName, "----");

	// var module = require(`${RoutesPath}/../public/js/00-basic/cookie.js`);
	// module.allDelete(req, res)

	var data = {
		message: '<p>・名前とパスワードを入力して下さい</p>',

		RoutesPath: RoutesPath,
		filepath: filepath,
		pageName: pageName,
	};
	res.render(`login`, data);
});

router.post('/', async (req, res, next) => {
	var pageName = `ログイン`
	console.log("----", pageName, "----");

	req.check('login_id', 'ログインID は必ず入力して下さい').notEmpty();
	req.check('password', 'パスワード は必ず入力して下さい').notEmpty();
	var errors = await req.getValidationResult();
	if (!errors.isEmpty()) {
		console.log("■バリデーション NG");
		var msg = '<ul class="error">';
		for (var e of errors.array()) {
			msg += '<li>' + e.msg + '</li>'
		}
		msg += '</ul>';
		var data = {
			message: msg,

			RoutesPath: RoutesPath,
			filepath: filepath,
			pageName: pageName,
		}
		return res.render(`login`, data);
		// return res.status(400).send({ msg: msg });
	}
	console.log('ログイン判定');
	var id = req.body.login_id;
	var pw = req.body.password;

	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			select *
			from m000admins
			where login_id = ? and password = ?
		`
		var param = [id, pw]
		var [rows, fields] = await connection.query(sql, param);
		if (!rows.length) {
			console.log('該当ユーザーが存在しない');
			var data = {
				message: '<p class="error">名前またはパスワードが違います</p>',

				RoutesPath: RoutesPath,
				filepath: filepath,
				pageName: pageName,
			};
			return res.render(`login`, data);
		}
		console.log('名前, パスワードに一致するユーザーが存在');
		req.session.login = rows[0];
		res.redirect(`/admin/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

module.exports = router;