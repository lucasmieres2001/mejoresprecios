const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController'); 

// POST /api/tracking - CREAR (array de trackings)
router.post('/', trackingController.controllerCreateTracking);

// GET /api/tracking - LISTAR TODOS (con filtros opcionales)
router.get('/', trackingController.controllerGetAllTracking);

// GET /api/tracking/:id - OBTENER POR ID
router.get('/:id', trackingController.controllerGetTrackingById);

// PUT /api/tracking - ACTUALIZAR (array de trackings)
router.put('/', trackingController.controllerUpdateTracking);

// DELETE /api/tracking - ELIMINAR (array de IDs)
router.delete('/', trackingController.controllerDeleteTracking);

module.exports = router;