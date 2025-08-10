const {jumboDairy} = require("./jumboDairy")
const {jumboDrinks} = require("./jumboDrinks")
const {jumboStore} = require("./jumboStore")
const {jumboMeats} = require("./jumboMeats")
const {jumboCleaning} = require("./jumboCleaning")
const {jumboFruitsVegetables} = require("./jumboFruitsVegetables")
const {jumboPets} = require("./jumboPets")

async function allJumboData() {
    let getJumboDairy = await jumboDairy();
    let getJumboDrinks = await jumboDrinks();
    let getJumboStore = await jumboStore();
    let getJumboMeats = await jumboMeats();
    let getJumboFruitsVegetables = await jumboFruitsVegetables();
    let getJumboCleaning = await jumboCleaning();
    let getJumboPets = await jumboPets();
    return {
        coto: {
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