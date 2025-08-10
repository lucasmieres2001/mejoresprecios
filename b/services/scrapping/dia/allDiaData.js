const { diaPets } = require('./diaPets');
const {diaDrinks} = require('./diaDrinks');
const { diaMeats } = require('./diaMeats');
const { diaCleaning } = require('./diaCleaning');
const {diaDairy} = require('./diaDairy');
const { diaFruitsVegetables } = require('./diaFruitsVegetables');
const { diaStore } = require('./diaStore');

async function allDiaData() {
    console.time("⏱ Total DIA scrape");

    console.time("  ⏳ Pets");
    let diaPet = await diaPets();
    console.timeEnd("  ⏳ Pets");

    console.time("  ⏳ Drinks");
    let diaDrink = await diaDrinks();
    console.timeEnd("  ⏳ Drinks");

    console.time("  ⏳ Meats");
    let diaMeat = await diaMeats();
    console.timeEnd("  ⏳ Meats");

    console.time("  ⏳ Dairy");
    let diaDairys = await diaDairy();
    console.timeEnd("  ⏳ Dairy");

    console.time("  ⏳ Cleaning");
    let diaCleanings = await diaCleaning();
    console.timeEnd("  ⏳ Cleaning");

    console.time("  ⏳ Fruits/Veg");
    let diaFruitVegetable = await diaFruitsVegetables();
    console.timeEnd("  ⏳ Fruits/Veg");

    console.time("  ⏳ Store");
    let diaStores = await diaStore();
    console.timeEnd("  ⏳ Store");

    console.timeEnd("⏱ Total DIA scrape");

    return {
        dia: {
            dairy: diaDairys,
            drinks: diaDrink,
            store: diaStores,
            meats: diaMeat,
            fruitsVegetables: diaFruitVegetable,
            cleaning: diaCleanings,
            pets: diaPet
        }
    };
}


module.exports = {
    allDiaData
}

