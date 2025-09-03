const fs = require('fs');
const { saveScrapeProduct } = require('../services/scrapping/saveScrapping');
const { allCarrefourData } = require('../services/scrapping/carrefour/allCarrefourData');
const {getAllArticles} = require("../services/scrapping/getAllArticles");

async function scrapeProductController(req, res) {
  try {
    let data = {};
      console.time('Tiempo de recopilación de datos: ');
      let test = await getAllArticles();
      fs.writeFileSync('debug_output.txt', JSON.stringify(test, null, 2)); // Formato legible
    console.timeEnd('Tiempo de recopilación de datos: ');

    
    if (Object.keys(data).length > 0) {
      const saved = await saveScrapeProduct(data);
      saved
      ? res.status(201).json(saved)
      : res.status(500).json({ error: 'Error al scrapear o guardar el producto 1' });
    }
    else 
      {
        return res.status(404).json({ error: 'No se encontraron datos para el producto' });
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al scrapear o guardar el producto 2' });
  }
}

module.exports = {
  scrapeProduct: scrapeProductController
};
