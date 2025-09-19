const { diaTemplate } = require('./diaTemplate');

async function allDiaData() {
    let getDiaDairy = await diaTemplate('frescos/lacteos','dairy');
    let getDiaDrinks = await diaTemplate('Bebidas','drinks');
    let getDiaStore = await diaTemplate('Almacen','store');
    let getDiaMeats = await diaTemplate('frescos/carniceria','meats');
    let getDiaFruitsVegetables = await diaTemplate('frescos/frutas-y-verduras','fruits');
    let getDiaCleaning = await diaTemplate('Limpieza','cleaning');
    let getDiaPets = await diaTemplate('Mascotas','pets');
    console.log("**************************FinDia******************************************");
    return {
        dia: {
            dairy: getDiaDairy,
            drinks: getDiaDrinks,
            store: getDiaStore,
            meats: getDiaMeats,
            fruitsVegetables: getDiaFruitsVegetables,
            cleaning: getDiaCleaning,
            pets: getDiaPets
        }
    };
}

module.exports = {
    allDiaData
};