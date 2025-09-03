const {neneCleaning} = require('./neneCleaning');
const {neneDairy} = require('./neneDairy')
const {neneDrinks} = require('./neneDrinks')  
const {neneFruitsVegetables} = require('./neneFruitsVegetables') 
const {neneMeats} = require('./neneMeats') 
const {nenePets} = require('./nenePets') 
const {neneStore} = require('./neneStore') 

async function allNeneData () {
    const getNeneCleaning = await neneCleaning();
    const getNeneDairy = await neneDairy();
    const getNeneDrinks = await neneDrinks();
    const getNeneFruitsVegetables = await neneFruitsVegetables();
    const getNeneMeats = await neneMeats();
    const getNenePets = await nenePets();
    const getNeneStore = await neneStore();
console.log("*************************FinNene*******************************************");
    return {
        elnene: {
            dairy: getNeneDairy,
            drinks: getNeneDrinks,
            store: getNeneStore,
            meats: getNeneMeats,
            fruitsVegetables: getNeneFruitsVegetables,
            cleaning: getNeneCleaning,
            pets: getNenePets
        }
    }
}

module.exports = {
    allNeneData
}