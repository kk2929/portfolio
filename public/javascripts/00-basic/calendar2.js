class CalendarGenerator {
	// 引数一覧。末尾に「!」がついているものは必須
	// params: year, month, row, column, 
	// dom: calendar!, prevMonthBtn, nextMonthBtn
	// html: calendarClass, calendarChildID
	constructor(obj = {}) {
		this.weeks = ['日', '月', '火', '水', '木', '金', '土']

		var today = new Date()
		this.year = obj.params?.year || today.getFullYear();
		this.month = obj.params?.month || today.getMonth() + 1;

		this.config = {	//カレンダーの行・列の数
			row: obj.params?.row || 1,
			column: obj.params?.column || 1,
		}

		this.calendarClass = obj.html?.calendarClass || "_calendar00"
		this.calendarChildID = obj.html?.calendarChildID || "c"

		this.calendar = obj.dom?.calendar
		console.log(this.calendar);
		this.prevMonthBtn = obj.dom?.prevMonthBtn
		this.nextMonthBtn = obj.dom?.nextMonthBtn

		this.prevMonthBtn?.addEventListener('click', (e) => { this.moveCalendar(-1) })
		this.nextMonthBtn?.addEventListener('click', (e) => { this.moveCalendar(1) })
	}
	/* 一画面分のカレンダー生成 */
	showCalendar() {
		var year = this.year
		var month = this.month

		this.calendar.innerHTML = ''
		console.log(this.calendar);

		for (let i = 1; i <= this.config.row; i++) {
			var c = document.createElement("div")
			c.id = `${this.calendarChildID}-${i}`
			this.calendar.appendChild(c)

			for (let j = 0; j < this.config.column; j++) {
				const calendarHtml = this.createCalendar(year, month)
				const sec = document.createElement('section')
				sec.innerHTML = calendarHtml
				document.querySelector(`#${this.calendarChildID}-${i}`).appendChild(sec)

				month++
				if (month > 12) {
					year++
					month = 1
				}
			}
		}
	}
	/* 1月分のカレンダー生成 */
	createCalendar(year, month) {
		const startDate = new Date(year, month - 1, 1)					// 月の最初の日付
		const endDate = new Date(year, month, 0) 								// 月の最後の日付
		const endDayCount = endDate.getDate() 									// 月の末日（数値）
		const lastMonthEndDate = new Date(year, month - 1, 0) 	// 前月の最後の日付
		const lastMonthEndDayCount = lastMonthEndDate.getDate() // 前月の末日（数値）
		const startDay = startDate.getDay() 										// 月の最初の日の曜日
		var dayCount = 1 			// 日にちのカウント
		var calendarHtml = '' // HTMLを組み立てる変数

		calendarHtml += `<table class="${this.calendarClass}">`
		calendarHtml += '<thead><tr>'

		// 曜日の行を作成
		for (var i = 0; i < this.weeks.length; i++) {
			if (i == 0) {
				calendarHtml += '<th style="color: red">' + this.weeks[i] + '</th>'
			} else if (i == 6) {
				calendarHtml += '<th style="color: blue">' + this.weeks[i] + '</th>'
			} else {
				calendarHtml += '<th>' + this.weeks[i] + '</th>'
			}
		}
		calendarHtml += '</thead></tr>'
		calendarHtml += '<tbody>'

		var isLastWeek = false
		for (var w = 0; w < 6; w++) {
			calendarHtml += '<tr>'

			for (var d = 0; d < 7; d++) {
				if (w == 0 && d < startDay) {
					// 1行目で1日の曜日の前
					var num = lastMonthEndDayCount - startDay + d + 1
					calendarHtml += '<td style="background-color: #ddd">' + num + '</td>'
				} else if (dayCount > endDayCount) {
					// 末尾の日数を超えた
					isLastWeek = true
					var num = dayCount - endDayCount
					calendarHtml += '<td style="background-color: #ddd">' + num + '</td>'
					dayCount++
				} else {
					var nowDate = moment(new Date()).format("YYYY-MM-DD")
					var data_date = `${year}-${("0" + month).slice(-2)}-${("0" + dayCount).slice(-2)}`
					var style = ""
					if (nowDate == data_date) style += 'border: 3px solid #f00;'	//今日に赤枠付ける

					calendarHtml += `<td data-date="${data_date}" style="cursor: pointer; ${style}">`

					calendarHtml += `<span>${dayCount}</span>`
					calendarHtml += `<div class="mt-1"></div>`
					calendarHtml += `</td>`
					dayCount++
				}
			}
			calendarHtml += '</tr>'
			if (isLastWeek) break
		}
		calendarHtml += '</tbody></table>'

		return calendarHtml
	}
	/* カレンダー切り替え */
	moveCalendar(variation) {
		this.month += variation

		if (this.month >= 13) {
			this.year += 1
			this.month -= 12
		}
		if (this.month <= 0) {
			this.year -= 1
			this.month += 12
		}
		this.showCalendar()
	}
	/* DOM取得 */
	getDateCells() {
		return document.querySelectorAll(`[data-date]`);
	}
}

/* 生成されるカレンダーの例
	<table class="_calendar00">
		<thead>
			<tr>
				<th style="color: red">日</th>
				<th>月</th>
				<th>火</th>
				<th>水</th>
				<th>木</th>
				<th>金</th>
				<th style="color: blue">土</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style="background-color: #ddd">31</td>
				<td data-date="2022-08-01" style="cursor: pointer; "><span>1</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-02" style="cursor: pointer; "><span>2</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-03" style="cursor: pointer; "><span>3</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-04" style="cursor: pointer; "><span>4</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-05" style="cursor: pointer; "><span>5</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-06" style="cursor: pointer; "><span>6</span>
					<div class="mt-1"></div>
				</td>
			</tr>
			...
			<tr>
				<td data-date="2022-08-28" style="cursor: pointer; "><span>28</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-29" style="cursor: pointer; "><span>29</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-30" style="cursor: pointer; "><span>30</span>
					<div class="mt-1"></div>
				</td>
				<td data-date="2022-08-31" style="cursor: pointer; "><span>31</span>
					<div class="mt-1"></div>
				</td>
				<td style="background-color: #ddd">1</td>
				<td style="background-color: #ddd">2</td>
				<td style="background-color: #ddd">3</td>
			</tr>
		</tbody>
	</table>
*/