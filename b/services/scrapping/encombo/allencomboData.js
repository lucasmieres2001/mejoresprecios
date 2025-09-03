const {encomboDairy} = require('./encomboDairy');
const {encomboCleaning} = require ('./encomboCleaning');
const {encomboDrinks} = require('./encomboDrinks');
const {encomboStore} = require('./encomboStore');


async function allEncomboData() {
    let getEncomboDairy = await encomboDairy();
    let getEncomboDrinks = await encomboDrinks();
    let getEncomboStore = await encomboStore();
    let getEncomboCleaning = await encomboCleaning();
    let empty = {
        title: '',
        price: 0.0,
        img: '',
        distributor: 'encombo',
        product: 'empty'
        }
console.log("**************************FinCombo******************************************");
    return {
        encombo: {
            dairy: getEncomboDairy,
            drinks: getEncomboDrinks,
            store: getEncomboStore,
            meats: empty,
            fruitsVegetables: empty,
            cleaning: getEncomboCleaning,
            pets: empty

        }
    }
}

module.exports = {
    allEncomboData
}