const {jumboTemplate} = require("./jumboTemplate");

async function allJumboData() {
    let getJumboDairy = await jumboTemplate('Lacteos','dairy');
    let getJumboDrinks = await jumboTemplate('Bebidas','drinks');
    let getJumboStore = await jumboTemplate('Almacen','store');
    let getJumboMeats = await jumboTemplate('Carnes','meats');
    let getJumboFruitsVegetables = await jumboTemplate('Frutas-y-verduras','fruits');
    let getJumboCleaning = await jumboTemplate('Limpieza','cleaning');
    let getJumboPets = await jumboTemplate('Mascotas','pets');
    console.log("*****************************FinJumbo***************************************");
    return {
        jumbo: {
            dairy: getJumboDairy,
            drinks: getJumboDrinks,
            store: getJumboStore,
            meats: getJumboMeats,
            fruitsVegetables: getJumboFruitsVegetables,
            cleaning: getJumboCleaning,
            pets: getJumboPets
        }
    }
}

module.exports = {
    allJumboData
}