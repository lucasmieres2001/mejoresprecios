const {discoTemplate} = require('./discoTemplate');


async function allDiscoData () {
    let getDiscoDairy = await discoTemplate("dairy","7");
    let getDiscoDrinks = await discoTemplate("drinks","2");
    let getDiscoMeats = await discoTemplate("meats","4");
    let getDiscoCleaning = await discoTemplate("cleaning","13");
    let getDiscoFruitsVegetables = await discoTemplate("fruits", "3");
    let getDiscoPets = await discoTemplate("pets","14");
    let getDiscoStore = await discoTemplate("store","1");

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