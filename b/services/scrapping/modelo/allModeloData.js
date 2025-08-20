const {modeloCleaning} = require('./modeloCleaning');
const {modeloDairy} = require('./modeloDairy');
const {modeloDrinks} = require('./modeloDrinks');
const {modeloFruitsVegetables} = require('./modeloFruitsVegetables');
const {modeloMeats} = require('./modeloMeats');
const {modeloPets} = require('./modelosPets');
const {modeloStore} = require('./modeloStore');

async function allModeloData () {
    return {
        modelo: {
            dairy: await modeloDairy(),
            drinks: await modeloDrinks(),
            store: await modeloStore(),
            meats: await modeloMeats(),
            fruitsVegetables: await modeloFruitsVegetables(),
            cleaning: await modeloCleaning(),
            pets: await modeloPets()
        }
    }
}

module.exports = {
    allModeloData
}