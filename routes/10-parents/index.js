const express = require('express');
const router = express.Router();
const path = require('path');
const filepath = path.relative(RoutesPath, __dirname).replace(/\\/g, "/");//routesディレクトリから見たこのファイルのあるディレクトリの相対パス

router.get('/', async (req, res, next) => {
	var module = require(`${RoutesPath}/../routes/_js/00-basic/cookie.js`);
	var filterData = module.getParentsFilter(req, res)
	var state = filterData.state
	try {
		var connection = await Mysql2.createConnection(DBSetting);
		await connection.beginTransaction();

		var whereSql = ""
		if (state) whereSql += `and state = ${state}`

		var sql = `
			select *
				, t1.p_id
			from m100parents as t1
			left join m110student as t2
				on t1.p_id = t2.p_id
			join (
				select t1.p_id, count(t2.p_id) as children_num
				from m100parents as t1
				left join m110student as t2
					on t1.p_id = t2.p_id
				group by t1.p_id
			) as t3
				on t1.p_id = t3.p_id
			where 1 = 1 ${whereSql}
			order by t1.p_id, t2.grade desc
			;`
		var [rows, fields] = await connection.query(sql);
		// console.log(rows[0]);

		var data = {
			column: [
				["編集", true],
				["授業予定", true],
				["保護者氏名", true],
				["続柄", false],
				["ログインID", true],
				["パスワード", true],
				["生徒数", true],
				["生徒氏名", true],
				["性別", false],
				["学年", true],
				["誕生日", false],
				["学校名", false],
				["生徒状態", false],
				["コース", true],
				["メールアドレス", true],
				["電話番号", true],
				["郵便番号", false],
				["住所", false],
				["契約状態", true],
				["契約日", false],
				["契約満了日", false],
				["備考", true],
			],
			rows: rows,
			filterData: filterData,
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
		connection.end();
	}
});

router.post('/', async (req, res, next) => {
	console.log(req.body);

	var module = require(`${RoutesPath}/../routes/_js/00-basic/cookie.js`);
	module.saveParentsFilter(req, res)

	res.redirect(`/admin/${filepath}/index/`);
});

module.exports = router;