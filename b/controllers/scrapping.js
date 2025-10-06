const fs = require('fs').promises;
const {getAllArticles} = require("../services/scrapping/getAllArticles");
const { pricesComparator } = require('../services/comparator/pricesComparator');
const {saveScrapeProduct} = require("../services/scrapping/saveScrapping");

async function scrapeProductController(req, res) {
  try {
    console.time('Tiempo de recopilación y comparación de datos: ');
    let dataList = await getAllArticles()
    
    console.log('Cantidad de supermercados procesados:', dataList.length);
    
    if (dataList && dataList.length > 0) {
      console.log('Entro en el if');
      
      const comparedPrices = pricesComparator(dataList)
      console.log('Productos comparados:', comparedPrices.length);
     
      // Verificar que hay datos para escribir
      if (comparedPrices && comparedPrices.length > 0) {
        try {
          // Guardar archivo de debug
          await fs.writeFile('debug_output.txt', JSON.stringify(comparedPrices, null, 2));
          console.log('Archivo debug_output.txt generado exitosamente');
          
          // Guardar en la base de datos - pasa el array completo
          const saveResult = await saveScrapeProduct(comparedPrices);
          
          console.timeEnd('Tiempo de recopilación y comparación de datos: ');
          
          if (saveResult.success) {
            return res.status(200).json(saveResult);
          } else {
            return res.status(500).json(saveResult);
          }
          
        } catch (writeError) {
          console.error('Error al escribir archivo:', writeError);
          return res.status(500).json({ 
            error: 'Error al procesar los datos',
            details: writeError.message 
          });
        }
      } else {
        console.log('No hay productos comparados para escribir');
        return res.status(400).json({ 
          message: 'No hay productos comparados para guardar' 
        });
      }
    } else {
      console.log('No entró en el if - dataList vacío');
      return res.status(400).json({ 
        message: 'No se encontraron datos para procesar' 
      });
    }
  } catch (error) {
    console.error('Error en scrapeProductController:', error);
    return res.status(500).json({ 
      error: 'Error al scrapear o guardar el producto',
      details: error.message 
    });
  }
}

module.exports = {
  scrapeProduct: scrapeProductController
};