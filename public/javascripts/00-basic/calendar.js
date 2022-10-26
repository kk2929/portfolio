class CalendarGenerator {
	constructor(obj = {}) {
		this.weeks = ['日', '月', '火', '水', '木', '金', '土']

		var today = new Date()
		this.year = obj.year || today.getFullYear();
		this.month = obj.month || today.getMonth() + 1;

		this.config = {	//カレンダーの行・列の数
			row: obj.row || 1,
			column: obj.column || 1,
		}

		this.calendarClass = obj.classNames?.calendar || "_calendar00"

		this.calendar = obj.idNames?.calendar || "calendar"
		this.prev = obj.idNames?.prev || "prev"
		this.next = obj.idNames?.next || "next"
		this.calendarChild = obj.idNames?.calendarChild || "c"

		document.querySelector(`#${this.prev}`).addEventListener('click', (e) => { this.moveCalendar(e) })
		document.querySelector(`#${this.next}`).addEventListener('click', (e) => { this.moveCalendar(e) })
	}
	/* 一画面分のカレンダー生成 */
	showCalendar() {
		var year = this.year
		var month = this.month

		document.querySelector(`#${this.calendar}`).innerHTML = ''

		for (let i = 1; i <= this.config.row; i++) {
			var c = document.createElement("div")
			c.id = `${this.calendarChild}${i}`
			document.querySelector(`#${this.calendar}`).appendChild(c)

			for (let j = 0; j < this.config.column; j++) {
				console.log(month);
				const calendarHtml = this.createCalendar(year, month)
				const sec = document.createElement('section')
				sec.innerHTML = calendarHtml
				document.querySelector(`#${this.calendarChild}${i}`).appendChild(sec)

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
		const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
		const endDate = new Date(year, month, 0) // 月の最後の日を取得
		const endDayCount = endDate.getDate() // 月の末日
		const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
		const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
		const startDay = startDate.getDay() // 月の最初の日の曜日を取得
		var dayCount = 1 // 日にちのカウント
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

		var isEnd = false
		for (var w = 0; w < 6; w++) {
			calendarHtml += '<tr>'

			for (var d = 0; d < 7; d++) {
				if (w == 0 && d < startDay) {
					// 1行目で1日の曜日の前
					var num = lastMonthendDayCount - startDay + d + 1
					calendarHtml += '<td style="background-color: #ddd">' + num + '</td>'
				} else if (dayCount > endDayCount) {
					// 末尾の日数を超えた
					isEnd = true
					var num = dayCount - endDayCount
					calendarHtml += '<td style="background-color: #ddd">' + num + '</td>'
					dayCount++
				} else {
					var nowDate = moment(new Date()).format("YYYY-MM-DD")
					var data_date = `${year}-${("0" + month).slice(-2)}-${("0" + dayCount).slice(-2)}`
					var style = ""
					if (nowDate == data_date) style += 'border: 3px solid #f00;'

					calendarHtml += `<td data-date="${data_date}" style="cursor: pointer; ${style}">`

					calendarHtml += `<span>${dayCount}</span>`
					calendarHtml += `<div class="mt-1"></div>`
					calendarHtml += `</td>`
					dayCount++
				}
			}
			calendarHtml += '</tr>'
			if (isEnd) break
		}
		calendarHtml += '</tbody></table>'

		return calendarHtml
	}
	/* カレンダー切り替え */
	moveCalendar(e) {
		if (e.target.id == this.prev) this.month--
		if (e.target.id == this.next) this.month++

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
}
