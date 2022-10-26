var app
(async () => {
	var createError = require('http-errors');
	var express = require('express');
	var path = require('path');
	var cookieParser = require('cookie-parser');
	var logger = require('morgan');

	require("dotenv").config();
	require("date-utils")
	var session = require("express-session");
	var validator = require("express-validator");

	var indexRouter = require('./routes/index');
	var usersRouter = require('./routes/users');

	app = express();

	console.log(__dirname);

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public/images/icons')));	//faviconなど
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(validator());	//express-validatorを使用するのに必要


	/* express-session の設定 */
	var session_opt = {
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: null },
	};
	app.use(session(session_opt));

	/* ルーティング。記述の順番に注意 */
	app.use("/login", require("./routes/00-ctrl/login"));	//下のログインページの設定より前に書く
	app.use("/logout", require("./routes/00-ctrl/logout"));	//下のログインページの設定より前に書く
	app.use("/*", require("./routes/00-ctrl/login-check")());	//ログインページの設定。階層が下のルーティングよりも先に書く
	const route = [
		["_api",
			["30-class"]],
		["10-parents",
			["index", "add", "edit", "edit-schedules"]],
		["20-teacher",
			["index", "add", "edit", "shift-edit"]],
		["30-class",
			["index", "generate"]],
	]
	await requireRoutes(route, ``)

	app.use('/', indexRouter);
	app.use('/users', usersRouter);

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404));
	});

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});
})();
module.exports = app

async function requireRoutes(arr, str = "") {
	// console.log("関数", arr, str);

	for (let e of arr) {
		if (Array.isArray(e)) {
			await requireRoutes(e[1], `${str}/${e[0]}`)
		} else {
			// console.log(`${str}/${e}`);
			app.use(`${str}/${e}`, require(`./routes${str}/${e}`));
		}
	}
}