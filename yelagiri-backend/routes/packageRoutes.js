const express = require('express');
const router = express.Router();
const { getPackages, getPackageById } = require('../controllers/packageController');

router.route('/').get(getPackages);
router.route('/:id').get(getPackageById);

module.exports = router;
