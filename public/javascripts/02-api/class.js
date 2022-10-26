var api = {
	/* 授業コマ日程 取得 */
	getClass: async function (year, month) {
		var obj = {
			year: year,
			month: month,
		}

		var res = await fetch('/admin/_api/30-class/getClass', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}).then(res => {
			if (!res.ok) throw res
			if (res.redirected) throw location.href = res.url
			return res.json();
		}).catch(err => {
			throw err
		});
		return res
	},
	/* 授業コマ日程+先生シフト 取得 */
	getClassWithTeacher_shift: async function (year, month, t_id) {
		console.log('/getClassWithTeacher_shift============================');
		var obj = {
			year: year,
			month: month,
			t_id: t_id
		}

		var res = await fetch('/admin/_api/30-class/getClassWithTeacher_shift', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}).then(res => {
			if (!res.ok) throw res
			if (res.redirected) throw location.href = res.url
			return res.json();
		}).catch(err => {
			throw err
		});
		return res
	},
	getClassReserve: async function (year, month, p_id) {
		console.log('/getClassReserve============================');
		var obj = {
			year: year,
			month: month,
			p_id: p_id
		}

		var res = await fetch('/admin/_api/30-class/getClassReserve', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}).then(res => {
			if (!res.ok) throw res
			if (res.redirected) throw location.href = res.url
			return res.json();
		}).catch(err => {
			throw err
		});
		return res
	},
	/* 日ごとの予約生徒数・先生数 */
	getDailyPersonCount: async function (year, month) {
		var obj = {
			year: year,
			month: month,
		}

		var res = await fetch('/admin/_api/30-class/getDailyPersonCount', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj)
		}).then(res => {
			if (!res.ok) throw res
			if (res.redirected) throw location.href = res.url
			return res.json();
		}).catch(err => {
			throw err
		});
		return res
	},
}
