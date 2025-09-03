const {mamiCleaning} = require ('./mamiCleaning');
const {mamiDairy} = require('./mamiDairy');
const {mamiDrinks} = require('./mamiDrinks');
const {mamiMeats} = require('./mamiMeats');
const {mamiFruitsVegetables} = require('./mamiFruitsVegetables');
const {mamiStore} = require('./mamiStore');
const {mamiPets} = require('./mamiPets');

const allMamiData = async () => {
    let getMamiCleaning = await mamiCleaning();
    let getMamiDairy = await mamiDairy();
    let getMamiDrinks = await mamiDrinks();
    let getMamiMeats = await mamiMeats();
    let getMamiFruitsVegetables = await mamiFruitsVegetables();
    let getMamiStore = await mamiStore();
    let getMamiPets = await mamiPets();
console.log("***************************FinMami*****************************************");
    return {
        mami: {
            dairy: getMamiDairy,
            drinks: getMamiDrinks,
            store: getMamiStore,
            meats: getMamiMeats,
            fruitsVegetables: getMamiFruitsVegetables,
            cleaning: getMamiCleaning,
            pets: getMamiPets
        }
    }
}

module.exports = {
    allMamiData
}

