const {discoTemplate} = require('./discoTemplate');


async function allDiscoData () {
    let getDiscoDairy = await discoTemplate("lacteos","dairy");
    let getDiscoDrinks = await discoTemplate("bebidas","drinks");
    let getDiscoMeats = await discoTemplate("carnes","meats");
    let getDiscoCleaning = await discoTemplate("limpieza","cleaning");
    let getDiscoFruitsVegetables = await discoTemplate("frutas-y-verduras", "fruits");
    let getDiscoPets = await discoTemplate("mascotas","pets");
    let getDiscoStore = await discoTemplate("almacen","store");
    return{
        disco: {
            dairy: getDiscoDairy,
            drinks: getDiscoDrinks,
            store: getDiscoStore,
            meats: getDiscoMeats,
            fruitsVegetables: getDiscoFruitsVegetables,
            cleaning: getDiscoCleaning,
            pets: getDiscoPets
        }
    }
}

module.exports = {
    allDiscoData
}