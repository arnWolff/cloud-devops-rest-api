const express = require('express');

const router = express.Router();

router.route('/.well-known/pki-validation/551550C2AE4BA1ADEC7B1BE6BD192838.txt').get(function (req, res) {
  res.sendFile('.551550C2AE4BA1ADEC7B1BE6BD192838.txt');
});

module.exports = router;
