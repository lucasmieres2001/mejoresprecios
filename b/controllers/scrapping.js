const fs = require('fs');
const {getAllArticles} = require("../services/scrapping/getAllArticles");
const { pricesComparator } = require('../services/comparator/pricesComparator');



async function scrapeProductController(req, res) {
  try {
      console.time('Tiempo de recopilación de datos: ');
      let dataList = await getAllArticles()
    console.timeEnd('Tiempo de recopilación de datos: ');
    if (Object.keys(dataList).length > 0) {
      console.log('Entro en el if');
      const comparedPrices = pricesComparator(dataList)
      fs.writeFileSync('debug_output.txt', JSON.stringify(comparedPrices, null, 2));
      return res.status(200).json({ message: 'Productos scrapados exitosamente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al scrapear o guardar el producto 2' });
  }
}

module.exports = {
  scrapeProduct: scrapeProductController
};
