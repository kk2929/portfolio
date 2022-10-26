const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");

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
			;`
		var params = [t_id, t_id, t_id]
		var [rows, fields] = await connection.query(sql, params);

		var data = {
			t_id: t_id,

			session: req.session?.login,
			filepath: filepath,
		};
		res.render(`${filepath}/shift-edit`, data);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		if (connection) connection.end();
	}
});

router.post('/:id/update', async (req, res, next) => {
	const module = require(`${RoutesPath}/../routes/_js/30-class/class.js`);

	var t_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var c_id
		if (Array.isArray(req.body.c_id)) {
			c_id = [...req.body.c_id]
		} else {
			c_id = [req.body.c_id]
		}

		var hidden_c_id
		if (Array.isArray(req.body.hidden_c_id)) {
			hidden_c_id = [...req.body.hidden_c_id]
		} else {
			hidden_c_id = [req.body.hidden_c_id]
		}

		for (const e of hidden_c_id) {
			console.log("==============================================");
			if (c_id.includes(e)) {
				/* チェックされている場合、既にデータがないかチェック */
				var sql = `
					select c_id
					from m210teacher_shift
					where c_id = ?
						and t_id = ?
					;`
				var param = [e, t_id]
				var [rows, fields] = await connection.query(sql, param);
				console.log(rows);
				if (rows[0]) continue
				/* OKならインサート */
				var obj = {
					t_id: t_id,
					c_id: e,
					status: 1,
				}
				await module.insertM210teacher_shift(connection, obj)
			} else {
				/* チェックがない場合 */
				await module.deleteM210teacher_shift(connection, t_id, e)
			}
			// await module.updateM300classNum(e)
		}
		await connection.commit();

		res.redirect(`/admin/${filepath}/shift-edit/${t_id}/`);
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