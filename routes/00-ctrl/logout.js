const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	console.log("ログアウトしました");
	req.session.destroy();

	res.redirect(`/admin/login/`);
});

module.exports = router;