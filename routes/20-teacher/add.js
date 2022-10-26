const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', async (req, res, next) => {
	var data = {
		session: req.session?.login,
		filepath: filepath,
	};
	res.render(`${filepath}/add`, data);
});

router.post('/', async (req, res, next) => {
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql0 = ``
		var sql1 = ``
		// var param = []
		// var keys = Object.keys(req.body);
		// for (var i in keys) {
		// sql0 += `${keys[i]}, `
		// sql1 += `?, `
		// param.push(req.body[keys[i]] || null)
		// }
		// sql0 = sql0.slice(0, -2);
		// sql1 = sql1.slice(0, -2);
		var param = [req.body]
		var sql = `
			insert into m200teacher
			set ?
			;`
		var [rows, fields] = await connection.query(sql, param);
		await connection.commit();

		res.redirect(`/admin/${filepath}/index/`);
		// res.redirect(`/admin/${filepath}/edit/${rows.insertId}/`);
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