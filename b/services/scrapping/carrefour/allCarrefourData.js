const {carrefourTemplate} = require("./carrefourTemplate");

async function allCarrefourData() {
    let getCarrefourDairy = await carrefourTemplate('Lacteos-y-productos-frescos','dairy');
    let getCarrefourDrinks = await carrefourTemplate('Bebidas','drinks');
    let getCarrefourStore = await carrefourTemplate('Almacen','store');
    let getCarrefourMeats = await carrefourTemplate('Carnes-y-Pescados','meats');
    let getCarrefourFruitsVegetables = await carrefourTemplate('Frutas-y-Verduras','fruits');
    let getCarrefourCleaning = await carrefourTemplate('Limpieza','cleaning');
    let getCarrefourPets = await carrefourTemplate('Mascotas','pets');
    console.log("**************************FinCarrefour******************************************");
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


