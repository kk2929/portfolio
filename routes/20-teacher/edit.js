const express = require('express');
const router = express.Router();
const path = require('path');
const { param } = require('express-validator/check');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/:id', async (req, res, next) => {
	var t_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			select t1.*
			from m200teacher as t1
			where t1.t_id = ?
			;
			select t1.*
			from m210teacher_shift as t1
			where t1.t_id = ?
			;
			select t1.*,
				date_format(t1.start_date, '%Y-%m-%d %T') as start_date
			from m300class as t1
			order by t1.start_date
			;`
		var params = [t_id, t_id]
		var [rows, fields] = await connection.query(sql, params);

		var data = {
			rows: rows[0][0],
			shift_rows: rows[1],
			class_rows: rows[2],

			session: req.session?.login,
			filepath: filepath,
		};
		res.render(`${filepath}/edit`, data);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/:id', async (req, res, next) => {
	var t_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var param = [req.body, t_id]

		var sql = `
			update m200teacher
			set ?
			where t_id = ?
			;`
		var [rows, fields] = await connection.query(sql, param);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${t_id}/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/:id/delete', async (req, res, next) => {
	var t_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			delete from m200teacher
			where t_id = ?
			;`
		var params = [t_id]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/index/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/:id/add-class/', async (req, res, next) => {
	var t_id = req.params.id
	var obj = { ...req.body }
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		for (var e of Object.keys(obj)) {
			if (obj[e] == "") obj[e] = null
		}
		obj.t_id = t_id
		obj.start_date = obj.start_date_h + ":" + obj.start_date_m
		obj.end_time = obj.end_time_h + ":" + obj.end_time_m
		delete obj.start_date_h
		delete obj.start_date_m
		delete obj.end_time_h
		delete obj.end_time_m

		console.log(obj);

		var sql = `
			insert into m300class
			set ?
			;`
		var [rows, fields] = await connection.query(sql, obj);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${t_id}/`);
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