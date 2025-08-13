const fs = require('fs');
const { saveScrapeProduct } = require('../services/scrapping/saveScrapping');
const { allCarrefourData } = require('../services/scrapping/carrefour/allCarrefourData');
const { allDiaData } = require('../services/scrapping/dia/allDiaData');
const {allVeaData} = require('../services/scrapping/vea/allVeaData');
const {allCotoData} = require('../services/scrapping/coto/allCotoData');
const {allJumboData} = require('../services/scrapping/jumbo/allJumboData');
const {allEncomboData} = require('../services/scrapping/encombo/allencomboData');
const {allNeneData} = require('../services/scrapping/elnene/allNeneData');


async function scrapeProductController(req, res) {
  const { url, hostname = "" } = req.body;

  try {
    let data = {};
    let carrefour = [];
    let dia = [];
    if (hostname.toLowerCase() === 'carrefour') {
      console.time('Tiempo de recopilación de datos: ');
    //carrefour.push( await allCarrefourData());
    //dia.push( await allDiaData());
    //console.log(JSON.stringify(dia));
      let test = await allCotoData();
      fs.writeFileSync('debug_output.txt', JSON.stringify(test, null, 2)); // Formato legible
    console.timeEnd('Tiempo de recopilación de datos: ');
    
    }
    else {
      return res.status(400).json({ error: 'Hostname no soportado' });
    }
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
