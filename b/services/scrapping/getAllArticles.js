const { allCarrefourData } = require('../scrapping/carrefour/allCarrefourData');
const { allDiaData } = require('../scrapping/dia/allDiaData');
const {allVeaData} = require('../scrapping/vea/allVeaData');
const {allCotoData} = require('../scrapping/coto/allCotoData');
const {allJumboData} = require('../scrapping/jumbo/allJumboData');
const {allEncomboData} = require('../scrapping/encombo/allencomboData');
const {allNeneData} = require('../scrapping/elnene/allNeneData');
const {allMamiData} = require('../scrapping/mami/allMamiData');
const {allDiscoData} = require('../scrapping/disco/allDiscoData');
const {allModeloData} = require('../scrapping/modelo/allModeloData');
const {allAnonimaData} = require('../scrapping/anonima/allAnonimaData');
const {allMaxiconsumoData} = require('../scrapping/maxiconsumo/allMaxiconsumoData'); //Está construido, debemos probar

exports.getAllArticles = async (req, res) => {
  try {
    const [carrefour, dia, vea, coto, jumbo, encombo, nene, mami, disco, modelo, anonima, maxiconsumo] = await Promise.all([
      allCarrefourData(),
      allDiaData(),
      allVeaData(),
      allCotoData(),
      allJumboData(),
      allEncomboData(),
      allNeneData(),
      allMamiData(),
      allDiscoData(),
      allModeloData(),
      allAnonimaData(),
      allMaxiconsumoData()
    ]);

    const allArticles = [
      ...carrefour,
      ...dia,
      ...vea,
      ...coto,
      ...jumbo,
      ...encombo,
      ...nene,
      ...mami,
      ...disco,
      ...modelo,
      ...anonima,
      ...maxiconsumo
    ];

    res.status(200).json(allArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
};