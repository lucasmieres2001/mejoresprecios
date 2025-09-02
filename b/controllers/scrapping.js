const fs = require('fs');
const { saveScrapeProduct } = require('../services/scrapping/saveScrapping');
const { getAllArticles } = require('../services/scrapping/getAllArticles');


async function scrapeProductController(req, res) {
  const { url, hostname = "" } = req.body;

  try {
    let data = {};
    let carrefour = [];
    let dia = [];
      console.time('Tiempo de recopilación de datos: ');
    //carrefour.push( await allCarrefourData());
    //dia.push( await allDiaData());
    //console.log(JSON.stringify(dia));
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
