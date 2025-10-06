const {allCarrefourData} = require("../scrapping/carrefour/allCarrefourData");
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
const { allMasData } = require("./mas/allMasData");
const {allMakroData} = require("./makro/allMakroData");
const {allLibertadData} = require("./libertad/allLibertadData");

exports.getAllArticles = async () => {
  try {
     return await Promise.all([
      allCarrefourData(),
      //allMasData(),
      allDiaData(),
      allVeaData(),
      allCotoData(),
      allJumboData(),
      //allEncomboData(),
      //allNeneData(),
      //allMamiData(),
      allDiscoData(),
      //allModeloData(),
      //allAnonimaData(),
      //allMaxiconsumoData(),
      //allMakroData(),
      //allLibertadData()
    ]);

  
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener los artículos');
  }
};