const express = require('express');
const router = express.Router();
const scrappingController = require('../controllers/scrapping');


// POST /api/products/scrapes
router.post('/scrapes', scrappingController.scrapeProduct);

module.exports = router;
