const { veaDairy } = require('./veaDairy');
const { veaDrinks } = require('./veaDrinks');
const { veaStore } = require('./veaStore');
const { veaMeats } = require('./veaMeats');
const { veaFruitsVegetables } = require('./veaFruitsVegetables');
const { veaCleaning } = require('./veaCleaning');
const { veaPets } = require('./veaPets');

async function allVeaData() {
    let getVeaDairy = await veaDairy();
    let getVeaDrinks = await veaDrinks();
    let getVeaStore = await veaStore();
    let getVeaMeats = await veaMeats();
    let getVeaFruitsVegetables = await veaFruitsVegetables();
    let getVeaCleaning = await veaCleaning();
    let getVeaPets = await veaPets();

    return {
        vea: {
            dairy: getVeaDairy,
            drinks: getVeaDrinks,
            store: getVeaStore,
            meats: getVeaMeats,
            fruitsVegetables: getVeaFruitsVegetables,
            cleaning: getVeaCleaning,
            pets: getVeaPets
        }
    };
}

module.exports = {
    allVeaData
}


