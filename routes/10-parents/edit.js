const express = require('express');
const router = express.Router();
const path = require('path');
// const { param } = require('express-validator/check');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/:id', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			select t1.*, children_num
			from m100parents as t1
			left join (
				select p_id, count(p_id) as children_num
				from m110student
				group by p_id
			) as t2
				on t1.p_id = t2.p_id
			where t1.p_id = ?
			;`
		var params = [p_id]
		var [rows, fields] = await connection.query(sql, params);
		var sql = `
			select *
			from m110student as t1
			where t1.p_id = ?
			order by t1.grade desc
			;`
		var params = [p_id]
		var [studentArr, fields] = await connection.query(sql, params);

		var data = {
			rows: rows[0],
			studentArr: studentArr,
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
		connection.end();
	}
});

router.post('/:id', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		for (var e of Object.keys(req.body)) {
			if (req.body[e] == "") req.body[e] = null
		}

		var sql = `
			update m100parents
			set ?
			where p_id = ?
			;`
		var params = [req.body, p_id]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${p_id}/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

router.post('/:id/delete', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			delete from m100parents
			where p_id = ?
			;
			delete from m110student
			where p_id = ?
			;`
		var params = [p_id, p_id]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/index/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

router.post('/:id/add-student/', async (req, res, next) => {
	var p_id = req.params.id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		for (var e of Object.keys(req.body)) {
			if (req.body[e] == "") req.body[e] = null
		}
		req.body.p_id = p_id

		var sql = `
			insert into m110student
			set ?
			;`
		var [rows, fields] = await connection.query(sql, [req.body]);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${p_id}/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

router.post('/:id/edit-student/:s_id', async (req, res, next) => {
	var p_id = req.params.id
	var s_id = req.params.s_id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			update m110student
			set ?
			where s_id = ?
			;`
		var params = [req.body, s_id]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${p_id}/`);
	}
	catch (error) {
		console.error(error);
		throw error;
	}
	finally {
		connection.end();
	}
});

router.post('/:id/delete-student/:s_id', async (req, res, next) => {
	var p_id = req.params.id
	var s_id = req.params.s_id
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var sql = `
			delete from m110student
			where s_id = ?
			;`
		var params = [s_id]
		var [rows, fields] = await connection.query(sql, params);
		await connection.commit();

		res.redirect(`/admin/${filepath}/edit/${p_id}/`);
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