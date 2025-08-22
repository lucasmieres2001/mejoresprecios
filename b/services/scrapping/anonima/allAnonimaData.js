const {anonimaTemplate} = require('./anonimaTemplate');

async function allAnonimaData () {
    return{
        anonima: {
            dairy: await anonimaTemplate("frescos/lacteos","n2_68","dairy"),
            drinks: await anonimaTemplate("bebidas","n1_2","drinks"),
            store: await anonimaTemplate("almacen","n1_1","store"),
            meats: await anonimaTemplate("carniceria","n1_8","meats"),
            fruitsVegetables: await anonimaTemplate("frutas-y-verduras","n1_7","fruits"),
            cleaning: await anonimaTemplate("limpieza","n1_4","cleaning"),
            pets: {
                url: "",
                title: "",
                price: "",
                img: "",
                distributor: "anonima",
                product: "mascotas"
            }
        }
    }
}

module.exports = {
    allAnonimaData
}