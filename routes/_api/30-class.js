const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");

router.post('/getClass', async (req, res, next) => {
	console.log('/getClass============================');
	var year = req.body.year
	var month = req.body.month

	var connection = await Mysql2.createConnection(DBSetting);
	var sql = `
		select t1.*,
			date_format(t1.start_date, '%Y-%m-%d %T') as start_date
		from m300class as t1
		group by t1.c_id
		order by t1.start_date
		;`
	var params = []
	var [rows, fields] = await connection.query(sql, params);
	console.log(rows[0]);

	res.status(200).send(rows);
});

router.post('/getClassWithTeacher_shift', async (req, res, next) => {
	var year = req.body.year
	var month = req.body.month
	var t_id = req.body.t_id

	var connection = await Mysql2.createConnection(DBSetting);
	var sql = `
		select t1.*,
			count(t3.t_id) as this_shift_co,
			date_format(t1.start_date, '%Y-%m-%d %T') as start_date
		from m300class as t1
		left join m210teacher_shift as t3
			on t1.c_id = t3.c_id 
				and t3.status != 9
				and t3.t_id = ?
		group by t1.c_id
		order by t1.start_date
		;`
	var params = [t_id]
	var [rows, fields] = await connection.query(sql, params);

	res.status(200).send(rows);
});

router.post('/getClassReserve', async (req, res, next) => {
	console.log('/getClassReserve============================');
	var p_id = req.body.p_id

	var connection = await Mysql2.createConnection(DBSetting);
	var sql = `
		select date_format(t2.start_date, '%Y-%m-%d %T') as start_date,
			t2.c_id,
			t2.end_time,
			t1.*, t3.*
		from m400class_reserve as t1
		left join m300class as t2
			on t1.c_id = t2.c_id
		left join m110student as t3
			on t1.s_id = t3.s_id
		where t3.p_id = ?
			and status != 9
		order by t2.start_date, t3.grade desc
		;`
	var params = [p_id]
	var [rows, fields] = await connection.query(sql, params);

	res.status(200).send(rows);
});

/* 日ごとの予約生徒数・先生数 */
router.post('/getDailyPersonCount', async (req, res, next) => {
	var year = req.body.year
	var month = req.body.month

	var connection = await Mysql2.createConnection(DBSetting);
	var sql = `
		select t1.*
		from m300class as t1
		left join m400class_reserve as t2
			on t1.c_id = t2.c_id 
				and t2.status != 9
		left join m210teacher_shift as t3
			on t1.c_id = t3.c_id 
				and t3.status != 9
		order by t1.start_date
		;`
	var params = []
	var [rows, fields] = await connection.query(sql, params);
	console.log(rows);

	res.status(200).send(rows);
});

module.exports = router;