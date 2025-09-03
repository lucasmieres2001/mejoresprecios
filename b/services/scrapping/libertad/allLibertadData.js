const {libertadDairy} = require('./libertadDairy');
const {libertadMeats} = require('./libertadMeats');
const {libertadDrinks} = require('./libertadDrinks');
const {libertadFruitsVegetables} = require('./libertadFruitsVegetables');
const {libertadCleaning} = require('./libertadCleaning');
const {libertadStore} = require('./libertadStore');
const {libertadPets} = require('./libertadPets');

async function allLibertadData () {
    let getLibertadDairy = await libertadDairy();
    let getLibertadMeats = await libertadMeats();
    let getLibertadDrinks = await libertadDrinks();
    let getLibertadFruitsVegetables = await libertadFruitsVegetables();
    let getLibertadCleaning = await libertadCleaning();
    let getLibertadStore = await libertadStore();
    let getLibertadPets = await libertadPets();
    
    return {
        libertad: {
        dairy: getLibertadDairy,
        drinks: getLibertadDrinks,
        store: getLibertadStore,
        meats: getLibertadMeats,
        fruitsVegetables: getLibertadFruitsVegetables,
        cleaning: getLibertadCleaning,
        pets: getLibertadPets
        }
    }
}

module.exports = {
    allLibertadData
}