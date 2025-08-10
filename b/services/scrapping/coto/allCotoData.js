const {cotoStore} = require('./cotoStore');
const {cotoDairy} = require('./cotoDairy');
const {cotoDrinks} = require('./cotoDrinks');
const {cotoMeats} = require('./cotoMeats');
const {cotoFruitsVegetables} = require('./cotoFruitsVegetables');
const {cotoCleaning} = require('./cotoCleaning');
const {cotoPets} = require('./cotoPets');

async function allCotoData() {
    let getCotoDairy = await cotoDairy();
    let getCotoDrinks = await cotoDrinks();
    let getCotoStore = await cotoStore();
    let getCotoMeats = await cotoMeats();
    let getCotoFruitsVegetables = await cotoFruitsVegetables();
    let getCotoCleaning = await cotoCleaning();
    let getCotoPets = await cotoPets();
    return {
        coto: {
            dairy: getCotoDairy,
            drinks: getCotoDrinks,
            store: getCotoStore,
            meats: getCotoMeats,
            fruitsVegetables: getCotoFruitsVegetables,
            cleaning: getCotoCleaning,
            pets: getCotoPets
        }
    }
}

module.exports = {
    allCotoData
}