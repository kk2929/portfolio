const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");

const DBModule = require(`${RoutesPath}/../routes/_js/30-class/class.js`);

router.get('/:id', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		var sql = `
			select *
			from m110student as t1
			where t1.p_id = ?
			order by t1.grade desc
			;`
		var params = [p_id]
		var [rows, fields] = await connection.query(sql, params);

		var data = {
			students: rows,
			p_id: p_id,

			session: req.session?.login,
			filepath: filepath,
		};
		res.render(`${filepath}/edit-schedules`, data);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

router.post('/:id/add', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var obj = { ...req.body }
		for (var e of Object.keys(obj)) {
			if (obj[e] == '') obj[e] = null;
		}
		obj.status = 0

		var connection = await Mysql2.createConnection(DBSetting);
		await DBModule.insertM400class_reserve(connection, obj)

		res.redirect(`/admin/${filepath}/edit-schedules/${p_id}/`);
	}
	catch (err) {
		console.error(err);
		throw err;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/:id/cancel', async (req, res, next) => {
	var p_id = req.params.id
	var reserve_id = req.body.reserve_id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await DBModule.cancelM400class_reserve(connection, reserve_id)

		res.redirect(`/admin/${filepath}/edit-schedules/${p_id}/`);
	}
	catch (err) {
		console.error(err);
		throw err;
	}
	finally {
		if (connection) connection.end();
	}
});

module.exports = router;