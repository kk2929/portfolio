/* m210teacher_shift */
exports.insertM210teacher_shift = async (connection, obj) => {
	var sql = `
		insert into m210teacher_shift
		set ?
		;`
	var param = [obj]
	var [rows, fields] = await connection.query(sql, param);

	var sql = `
		update m300class as t1
		set t_co = t_co + 1
		where t1.c_id = ?
		;`
	var params = [obj.c_id]
	var [rows, fields] = await connection.query(sql, params);
}
exports.deleteM210teacher_shift = async (connection, t_id, c_id) => {
	var sql = `
		delete from m210teacher_shift
		where t_id = ?
			and c_id = ?
		;`
	var param = [t_id, c_id]
	var [rows, fields] = await connection.query(sql, param);
	if (!rows.affectedRows) return

	var sql = `
		update m300class as t1
		set t_co = t_co - 1
		where t1.c_id = ?
		;`
	var params = [c_id]
	var [rows, fields] = await connection.query(sql, params);
}

/* m400class_reserve */
exports.insertM400class_reserve = async (connection, obj) => {
	var sql = `
		insert into m400class_reserve
		set ?
		;`
	var params = [obj]
	var [rows, fields] = await connection.query(sql, params);

	var sql = `
		update m300class as t1
		set s_co = s_co + 1
		where t1.c_id = ?
		;`
	var params = [obj.c_id]
	var [rows, fields] = await connection.query(sql, params);
}
exports.cancelM400class_reserve = async (connection, reserve_id) => {
	var sql = `
		update m400class_reserve
		set status = 9
		where id = ?
		;`
	var params = [reserve_id]
	var [rows, fields] = await connection.query(sql, params);
	// if (!rows.affectedRows) return

	var sql = `
		select c_id
		from m400class_reserve
		where id = ?
		;`
	var params = [reserve_id]
	var [rows, fields] = await connection.query(sql, params);

	var sql = `
		update m300class as t1
		set s_co = s_co - 1
		where t1.c_id = ?
		;`
	var params = [rows[0].c_id]
	var [rows, fields] = await connection.query(sql, params);
}

