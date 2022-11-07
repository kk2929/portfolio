const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");

const moment = require('moment');

router.get('/', async (req, res, next) => {
	try {
		var connection = await Mysql2.createConnection(DBSetting);

		/* 現在どこまで授業コマが追加してあるか取得 */
		var rows = await getClass_generate_date(connection)
		var generateStartDate = moment(rows[0].exe_date).add(1, 'days')//.format("YYYY-MM-DD")

		// var finish_date = moment().add(1, 'days').format("YYYY年MM月DD日 HH時mm分s秒 d dd ddd dddd")
		var finish_date = moment().add(3, 'month')//.format("YYYY-MM-DD")

		while (generateStartDate.isBefore(finish_date)) {
			var d1 = generateStartDate.format("YYYY-MM-DD")
			var d2 = finish_date.format("YYYY-MM-DD")
			console.log(d1, d2);

			await insertClass(d1, generateStartDate.format("d"))

			generateStartDate.add(1, 'days')
		}

		/* 現在どこまで授業コマが追加してあるか記録 */
		await updateClass_generate_date(connection, finish_date.format("YYYY-MM-DD"), rows[0].id)

		res.redirect(`/admin/${filepath}/index/`);
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		if (connection) connection.end();
	}
});

/* ********************************************************************** */
/* 関数 */
async function getClass_generate_date(connection) {
	try {
		var sql = `
			select *
			from m395class_generate_date
			;`
		var params = []
		var [rows, fields] = await connection.query(sql, params);
		return rows
	} catch (err) {
		throw err;
	}
}
async function insertClass(date, day_index) {
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		var sql = `
			select *
			from m390class_timetable
			where day_index = ?
			;`
		var params = [day_index]
		var [rows, fields] = await connection.query(sql, params);
		console.log(rows);

		for (const e of rows) {
			var sql = `
				insert into m300class
				set ?
				;`
			var obj = {
				start_date: date + " " + e.start_time,
				end_time: e.end_time,
				s_co: 0,
				t_co: 0,
			}
			console.log("============================");
			console.log(obj);
			var params = [obj]
			var [rows, fields] = await connection.query(sql, params);
		}
	} catch (err) {
		throw err;
	}
}
async function updateClass_generate_date(connection, date, id) {
	try {
		var sql = `
			update m395class_generate_date
			set ?
			where id = ?
			;`
		var obj = {
			exe_date: date
		}
		var params = [obj, id]
		var [rows, fields] = await connection.query(sql, params);
	} catch (err) {
		throw err;
	}
}

/* ****************************************** */
/* 定時処理 ************************************* */
const cron = require('node-cron');
require("date-utils")

// 毎秒実行
// cron.schedule('* * * * * *', () => console.log("test"));
var time
// time = "* * * * * *"	// 毎秒
// time = "*/30 * * * * *"	// 30秒ごと
// time = "0,5,30 * * * * *"	// 毎分0,5,30秒
// time = "0 * * * * *"	// 毎分0秒
time = "0 0 2 * * *"	// 毎日2時
// time = "0 0 0,12 * * *"	// 毎日0,12時
// time = "0 0 0 1 * *"	// 毎月 1日 00:00:00

cron.schedule(time, async () => {
	return;
	var today = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
	console.log("処理日時：", today)

	try {
		var exe_date = new Date()

		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		await connection.commit();
	}
	catch (error) {
		if (connection) await connection.rollback();
		console.error(error);
	}
	finally {
		if (connection) connection.end();
	}
});

module.exports = router;