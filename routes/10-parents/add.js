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

		for (var e of Object.keys(req.body)) {
			if (req.body[e] == "") req.body[e] = null
		}

		var sql = `
			insert into m100parents
			set ?
			;`
		var params = [req.body]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${rows.insertId}/`);
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