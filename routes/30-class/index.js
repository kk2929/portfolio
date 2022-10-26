const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', async (req, res, next) => {
	try {
		var data = {
			session: req.session?.login,
			filepath: filepath,
		};
		res.render(`${filepath}/index`, data);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
});

router.post('/', async (req, res, next) => {
	res.redirect(`/admin/${filepath}/index/`);
});

router.post('/add', async (req, res, next) => {
	try {
		var obj = { ...req.body }
		for (var e of Object.keys(obj)) {
			if (obj[e] == '') obj[e] = null;
		}
		obj.s_co = 0
		obj.t_co = 0

		var connection = await Mysql2.createConnection(DBSetting);
		var sql = `
			insert into m300class
			set ?
			;`
		var params = [obj]
		var [rows, fields] = await connection.query(sql, params);

		res.redirect(`/admin/${filepath}/index/`);
	}
	catch (err) {
		console.error(err);
		throw err;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/delete', async (req, res, next) => {
	var c_id = req.body.c_id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		var sql = `
			delete from m300class
			where c_id = ?
			;`
		var params = [c_id]
		var [rows, fields] = await connection.query(sql, params);
		console.log("====================");
		console.log(c_id);
		console.log(rows);
		res.redirect(`/admin/${filepath}/index/`);
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		if (connection) connection.end();
	}
});

module.exports = router;