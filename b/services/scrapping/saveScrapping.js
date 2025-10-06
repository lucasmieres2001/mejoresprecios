const { Product } = require('../../models');

exports.saveScrapeProduct = async (productsArray) => {
  try {
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return {
        success: false,
        message: 'No hay productos para guardar'
      };
    }

    // Verificar si la tabla tiene registros
    const existingCount = await Product.count();
    
    if (existingCount > 0) {
      console.log(`La tabla contiene ${existingCount} registros. Eliminando...`);
      
      // Opción más eficiente: usar truncate (reinicia los autoincrementales)
      await Product.destroy({
        where: {},
        truncate: true, // Usa TRUNCATE en lugar de DELETE (más rápido)
        restartIdentity: true // Reinicia los contadores autoincrementales
      });
      
      console.log('Registros anteriores eliminados correctamente');
    } else {
      console.log('La tabla está vacía, procediendo a insertar nuevos registros');
    }

    let savedCount = 0;
    let errors = [];

    // Usar Promise.all para insertar en paralelo (más rápido)
    const results = await Promise.allSettled(
      productsArray.map(productData => 
        Product.create(productData)
      )
    );

    // Procesar resultados
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        savedCount++;
      } else {
        errors.push({
          product: productsArray[index].title,
          error: result.reason.message
        });
        console.error(`Error al guardar producto: ${productsArray[index].title}`, result.reason);
      }
    });

    return {
      success: true,
      message: `Tabla actualizada: ${savedCount} nuevos registros de ${productsArray.length}`,
      previousRecords: existingCount,
      savedCount,
      totalCount: productsArray.length,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('Error general al guardar productos:', error);
    return {
      success: false,
      message: 'Error al guardar productos',
      error: error.message
    };
  }
}