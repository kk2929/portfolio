/* クッキーに関する関数まとめ */
/* クッキーを全消去 */
exports.allDelete = function (req, res) {
	console.log("cookie = ", req.cookies);
	for (const p in req.cookies) {
		console.log("property = ", p);
		res.cookie(p, 0, { maxAge: 0 })
	}
	console.log("cookie(消去中) = ", req.cookies);
}

/* クッキーのやり取り(1ページの最大表示件数) */
exports.rowLimit = function (req, res, isDefault = false) {
	var rowLimit;
	if (req.body.rowLimit) {
		rowLimit = Number(req.body.rowLimit);
		res.cookie('rowLimit', rowLimit, { maxAge: 1000 * 60 * 60 * 24 })
		console.log('use req.body, rowLimit =' + rowLimit);
	} else if (req.cookies.rowLimit) {
		rowLimit = Number(req.cookies.rowLimit);
		console.log('use cookie, rowLimit =', rowLimit);
	} else {
		rowLimit = 20;
		res.cookie('rowLimit', rowLimit, { maxAge: 1000 * 60 * 60 * 24 })
		console.log('use default, rowLimit =' + rowLimit);
	};
	return rowLimit;
}

/* クッキーの保存(保護者の絞り込み) */
exports.saveParentsFilter = function (req, res) {
	var filterData = req.body;
	res.cookie('parentsFilter', filterData, { maxAge: 1000 * 60 * 60 * 24 });
}

/* クッキーの取得(保護者の絞り込み) */
exports.getParentsFilter = function (req, res, isDefault = false) {
	var filterData = {};

	if (req.cookies.parentsFilter) {
		filterData = req.cookies.parentsFilter;

		/* undefinedを "" に直す */
		var keys = Object.keys(filterData);
		for (var i in keys) {
			if (filterData[keys[i]] == undefined) {
				filterData[keys[i]] = "";
			}
		}
	} else {
		filterData = {
			state: "",
		};
	};
	res.cookie('parentsFilter', filterData, { maxAge: 1000 * 60 * 60 * 24 });

	return filterData;
}


/* クッキーの保存(先生の絞り込み) */
exports.saveTeacherFilter = function (req, res) {
	var filterData = req.body;
	res.cookie('teacherFilter', filterData, { maxAge: 1000 * 60 * 60 * 24 });
}

/* クッキーの取得(先生の絞り込み) */
exports.getTeacherFilter = function (req, res, isDefault = false) {
	var filterData = {};

	if (req.cookies.teacherFilter) {
		filterData = req.cookies.teacherFilter;

		/* undefinedを "" に直す */
		var keys = Object.keys(filterData);
		for (var i in keys) {
			if (filterData[keys[i]] == undefined) {
				filterData[keys[i]] = "";
			}
		}
	} else {
		filterData = {
			state: "",
		};
	};
	res.cookie('teacherFilter', filterData, { maxAge: 1000 * 60 * 60 * 24 });

	return filterData;
}