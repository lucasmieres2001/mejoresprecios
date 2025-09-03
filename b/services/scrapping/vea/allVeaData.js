const {veaTemplate} = require("./veaTemplate");

async function allVeaData() {
    let getVeaDairy = await veaTemplate("lacteos", "dairy");
    let getVeaDrinks = await veaTemplate("bebidas", "drinks");
    let getVeaStore = await veaTemplate("almacen", "store");
    let getVeaMeats = await veaTemplate("carnes", "meats");
    let getVeaFruitsVegetables = await veaTemplate("frutas-y-verduras", "fruits");
    let getVeaCleaning = await veaTemplate("limpieza", "cleaning");
    let getVeaPets = await veaTemplate("mascotas", "pets");
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


