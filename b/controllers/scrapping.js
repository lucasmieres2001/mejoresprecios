const fs = require('fs').promises;
const {getAllArticles} = require("../services/scrapping/getAllArticles");
const { pricesComparator } = require('../services/comparator/pricesComparator');



async function scrapeProductController(req, res) {
  try {
    console.time('Tiempo de recopilación y comparación de datos: ');
    let dataList = await getAllArticles()
    
    
    console.log('Cantidad de supermercados procesados:', dataList.length);
    console.log('Keys de dataList:', Object.keys(dataList));
    
    if (Object.keys(dataList).length > 0) {
      console.log('Entro en el if');
      
      const comparedPrices = pricesComparator(dataList)
      console.log('Productos comparados:', comparedPrices.length);
      
      // Verificar que hay datos para escribir
      if (comparedPrices && comparedPrices.length > 0) {
        try {
          await fs.writeFile('debug_output.txt', JSON.stringify(comparedPrices, null, 2));
          console.log('Archivo debug_output.txt generado exitosamente');
          console.timeEnd('Tiempo de recopilación y comparación de datos: ');
        } catch (writeError) {
          console.error('Error al escribir archivo:', writeError);
        }
      } else {
        console.log('No hay productos comparados para escribir');
      }
      
      return res.status(200).json({ message: 'Productos scrapados exitosamente' });
    } else {
      console.log('No entró en el if - dataList vacío');
    }
  } catch (error) {
    console.error('Error en scrapeProductController:', error);
    res.status(500).json({ error: 'Error al scrapear o guardar el producto 2' });
  }
}

module.exports = {
  scrapeProduct: scrapeProductController
};
