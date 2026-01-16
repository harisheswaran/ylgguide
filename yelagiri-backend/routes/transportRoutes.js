const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getTransports, addTransport, uploadTransportCSV } = require('../controllers/transportController');

// Multer Setup for CSV Uploads
const upload = multer({ dest: 'uploads/' });

router.get('/', getTransports);
router.post('/', addTransport);
router.post('/upload', upload.single('csvFile'), uploadTransportCSV);

module.exports = router;
