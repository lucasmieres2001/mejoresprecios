const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users
router.post('/register', userController.controllerCreateUser);

// GET /api/users
router.get('/', userController.controllerGetAllUsers);

module.exports = router;
