const express = require('express');
const router = express.Router();
RoutesPath = __dirname;	//routesフォルダのパスをグローバル変数に。他の.jsファイル内で、.ejsの指定などで使用する。

Mysql2 = require('mysql2/promise');

DBSetting = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: 'utf8',
  multipleStatements: true,	//一度に複数のクエリを実行できる
};

router.get('/', (req, res, next) => {
  console.log('--------process.memoryUsage().heapUsed[MB]--------\n', Math.round(process.memoryUsage().heapUsed / (1000 * 100)) / 10 + "MB");

  var data = {
    session: req.session?.login,
  };
  res.render('index', data);
});

module.exports = router;