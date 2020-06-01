const router = require('express').Router();
const cfg = require('../../config');

router.get('/', (req, res) => {
  res.render('main', { nums: [...Array(cfg.get('paramNum')).keys()].map((i) => i + 1) });
});

module.exports = router;
