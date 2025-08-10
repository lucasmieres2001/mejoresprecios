const { carrefourDairy} = require('./carrefourDairy');
const { carrefourDrinks } = require('./carrefourDrinks');
const { carrefourStore } = require('./carrefourStore');
const { carrefourMeats } = require('./carrefourMeats');
const { carrefourFruitsVegetables } = require('./carrefourFruitsVegetables');
const { carrefourCleaning } = require('./carrefourCleaning');
const { carrefourPets } = require('./carrefourPets');

async function allCarrefourData() {
    let getCarrefourDairy = await carrefourDairy();
    let getCarrefourDrinks = await carrefourDrinks();
    let getCarrefourStore = await carrefourStore();
    let getCarrefourMeats = await carrefourMeats();
    let getCarrefourFruitsVegetables = await carrefourFruitsVegetables();
    let getCarrefourCleaning = await carrefourCleaning();
    let getCarrefourPets = await carrefourPets();
    return {
        carrefour: {
            dairy: getCarrefourDairy,
            drinks: getCarrefourDrinks,
            store: getCarrefourStore,
            meats: getCarrefourMeats,
            fruitsVegetables: getCarrefourFruitsVegetables,
            cleaning: getCarrefourCleaning,
            pets: getCarrefourPets
        }
    };
}

module.exports = {
    allCarrefourData
}


