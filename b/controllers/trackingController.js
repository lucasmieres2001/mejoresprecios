const { 
  createTracking, 
  getAllTracking, 
  getTrackingById, 
  updateTracking, 
  deleteTracking 
} = require("../services/tracking/trackingService");

// CREATE - Registrar nuevo tracking (array de objetos)
async function controllerCreateTracking(req, res) {
  console.log('Datos del tracking:', req.body);
  const trackingDataArray = req.body;
  
  try {
    const result = await createTracking(trackingDataArray);
    
    // Contar cuántos se crearon exitosamente
    const successCount = result.filter(r => r === true).length;
    const totalCount = result.length;
    
    if (successCount > 0) {
      res.status(201).json({ 
        message: `${successCount} de ${totalCount} tracking(s) creado(s) exitosamente`,
        created: successCount,
        total: totalCount,
        details: result
      });
    } else {
      res.status(400).json({ 
        error: 'No se pudieron crear los trackings (posiblemente ya existen)',
        details: result 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Error interno al crear tracking',
      details: error.message 
    });
  }
}

// READ - Obtener todos los trackings (con filtros opcionales)
async function controllerGetAllTracking(req, res) {
  try {
    const { userId, productId, action } = req.query;
    
    const trackings = await getAllTracking({ userId, productId, action });
    
    res.status(200).json({
      message: 'Trackings obtenidos exitosamente',
      count: trackings.length,
      data: trackings
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener trackings',
      details: error.message 
    });
  }
}

// READ - Obtener tracking por ID
async function controllerGetTrackingById(req, res) {
  try {
    const { id } = req.params; // Cambié de req.query a req.params para consistencia
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    const tracking = await getTrackingById(id);
    
    if (!tracking) {
      return res.status(404).json({ error: 'Tracking no encontrado' });
    }
    
    res.status(200).json({
      message: 'Tracking obtenido exitosamente',
      data: tracking
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener tracking',
      details: error.message 
    });
  }
}

// UPDATE - Actualizar tracking (acepta array o objeto único)
async function controllerUpdateTracking(req, res) {
  try {
    const updateDataArray = req.body;
    
    if (!Array.isArray(updateDataArray)) {
      return res.status(400).json({ 
        error: 'Se espera un array de objetos para actualizar' 
      });
    }
    
    const results = await updateTracking(updateDataArray);
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    res.status(200).json({
      message: `${successCount} de ${totalCount} tracking(s) actualizado(s) exitosamente`,
      updated: successCount,
      total: totalCount,
      details: results
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar trackings',
      details: error.message 
    });
  }
}

// DELETE - Eliminar tracking (acepta array de IDs o ID único)
async function controllerDeleteTracking(req, res) {
  try {
    const { ids } = req.body; // Puede ser un array de IDs o un solo ID
    
    if (!ids) {
      return res.status(400).json({ error: 'IDs are required' });
    }
    
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const results = await deleteTracking(idsArray);
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    res.status(200).json({
      message: `${successCount} de ${totalCount} tracking(s) eliminado(s) exitosamente`,
      deleted: successCount,
      total: totalCount,
      details: results
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar trackings',
      details: error.message 
    });
  }
}

module.exports = {
  controllerCreateTracking,
  controllerGetAllTracking,
  controllerGetTrackingById,
  controllerUpdateTracking,
  controllerDeleteTracking
};