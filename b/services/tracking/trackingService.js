const { Tracking } = require('../../models');

// CREATE - Crear trackings (array de objetos)
async function createTracking(trackingDataArray) {
  try {
    const dataArray = Array.isArray(trackingDataArray) ? trackingDataArray : [trackingDataArray];

    const results = await Promise.all(
      dataArray.map(async ({ userId, productId, action }) => {
        // Verificar si ya existe un tracking con los mismos userId y productId
        const existingTracking = await Tracking.findOne({ where: { userId, productId } });
        if (existingTracking) {
          console.log(`Tracking ya existe para usuario ${userId} y producto ${productId}.`);
          return false;
        }
        // Si no existe, crear uno nuevo
        const newTracking = await Tracking.create({ userId, productId, action });
        console.log('Nuevo tracking creado:', newTracking);
        return true;
      })
    );

    return results;
  } catch (error) {
    console.error('Error al crear tracking:', error);
    throw error;
  }
}

// READ - Obtener todos los trackings (con filtros opcionales)
async function getAllTracking(filters = {}) {
  try {
    const whereClause = {};
    
    // Aplicar filtros si se proporcionan
    if (filters.userId) whereClause.userId = filters.userId;
    if (filters.productId) whereClause.productId = filters.productId;
    if (filters.action) whereClause.action = filters.action;

    const trackings = await Tracking.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return trackings;
  } catch (error) {
    console.error('Error al obtener trackings:', error);
    throw error;
  }
}

// READ - Obtener tracking por ID
async function getTrackingById(id) {
  try {
    const tracking = await Tracking.findByPk(id);
    return tracking;
  } catch (error) {
    console.error('Error al obtener tracking por ID:', error);
    throw error;
  }
}

// UPDATE - Actualizar trackings (array de objetos con id y datos a actualizar)
async function updateTracking(updateDataArray) {
  try {
    const results = await Promise.all(
      updateDataArray.map(async (updateData) => {
        try {
          const { id, ...updateFields } = updateData;
          
          if (!id) {
            return { success: false, error: 'ID es requerido', id: null };
          }

          const tracking = await Tracking.findByPk(id);
          
          if (!tracking) {
            return { success: false, error: 'Tracking no encontrado', id };
          }

          await tracking.update(updateFields);
          console.log(`Tracking ${id} actualizado exitosamente`);
          
          return { success: true, id };
        } catch (error) {
          console.error(`Error al actualizar tracking ${updateData.id}:`, error);
          return { success: false, error: error.message, id: updateData.id };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Error general al actualizar trackings:', error);
    throw error;
  }
}

// DELETE - Eliminar trackings (array de IDs)
async function deleteTracking(idsArray) {
  try {
    const results = await Promise.all(
      idsArray.map(async (id) => {
        try {
          const tracking = await Tracking.findByPk(id);
          
          if (!tracking) {
            return { success: false, error: 'Tracking no encontrado', id };
          }

          await tracking.destroy();
          console.log(`Tracking ${id} eliminado exitosamente`);
          
          return { success: true, id };
        } catch (error) {
          console.error(`Error al eliminar tracking ${id}:`, error);
          return { success: false, error: error.message, id };
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Error general al eliminar trackings:', error);
    throw error;
  }
}

module.exports = {
  createTracking,
  getAllTracking,
  getTrackingById,
  updateTracking,
  deleteTracking
};