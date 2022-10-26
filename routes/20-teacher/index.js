const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', async (req, res, next) => {
	var module = require(`${RoutesPath}/../routes/_js/00-basic/cookie.js`);
	// var filterData = module.getTeacherFilter(req, res)
	// var state = filterData.state
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var whereSql = ""
		// if (state) whereSql += `and state = ${state}`

		var sql = `
			select *
			from m200teacher as t1
			where 1 = 1 ${whereSql}
			order by t1.kana_family_name, t1.kana_first_name
			;`
		var [rows, fields] = await connection.query(sql);
		// console.log(rows[0]);

		var data = {
			column: [
				["編集", true],
				["シフト", true],
				["氏名", true],
				// ["生徒数", true],
				["性別", false],
				["メールアドレス", true],
				["電話番号", true],
				["備考", true],
			],
			rows: rows,
			// filterData: filterData,
			session: req.session?.login,
			filepath: filepath,
		};
		res.render(`${filepath}/index`, data);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/', async (req, res, next) => {
	console.log(req.body);

	var module = require(`${RoutesPath}/../routes/_js/00-basic/cookie.js`);
	module.saveTeacherFilter(req, res)

	res.redirect(`/admin/${filepath}/index/`);
});

module.exports = router;