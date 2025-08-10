const {masDairy} = require('./masDairy');
const {masCleaning} = require('./masCleaning');
const {masPets} = require('./masPets');
const {masStore} = require('./masStore');
const {masMeats} = require('./masMeats');
const {masFruitsVegetables} = require('./masFruitsVegetables');
const {masDrinks} = require('./masDrinks');

async function allMasData () {
    let getMasDairy = await masDairy();
    let getMasDrinks = await masDrinks();
    let getMasStore = await masStore();
    let getMasMeats = await masMeats();
    let getMasFruitsVegetables = await masFruitsVegetables();
    let getMasCleaning = await masCleaning();
    let getMasPets = await masPets();
    return{
        mas: {
            dairy: getMasDairy,
            drinks: getMasDrinks,
            store: getMasStore,
            meats: getMasMeats,
            fruitsVegetables: getMasFruitsVegetables,
            cleaning: getMasCleaning,
            pets: getMasPets
        }
    }
}

module.exports = {
    allMasData
}