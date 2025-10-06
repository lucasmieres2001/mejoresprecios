const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController'); 

// POST /api/tracking - CREAR (array de trackings)
router.post('/tracking', trackingController.controllerCreateTracking);

// GET /api/tracking - LISTAR TODOS (con filtros opcionales)
router.get('/tracking', trackingController.controllerGetAllTracking);

// GET /api/tracking/:id - OBTENER POR ID
router.get('/tracking/:id', trackingController.controllerGetTrackingById);

// PUT /api/tracking - ACTUALIZAR (array de trackings)
router.put('/tracking', trackingController.controllerUpdateTracking);

// DELETE /api/tracking - ELIMINAR (array de IDs)
router.delete('/tracking', trackingController.controllerDeleteTracking);

module.exports = router;