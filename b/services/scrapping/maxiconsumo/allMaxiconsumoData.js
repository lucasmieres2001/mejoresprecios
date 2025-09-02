const {maxiconsumoTemplate} = require("./maxiconsumoTemplate");

async function allMaxiconsumoData () {
    return{
        maxiconsumo: {
            dairy: await maxiconsumoTemplate("frescos/lacteos","dairy"),
            drinks: await maxiconsumoTemplate("bebidas","drinks"),
            store: await maxiconsumoTemplate("almacen","store"),
            meats: await maxiconsumoTemplate("frescos/carnes","meats"),
            fruitsVegetables: {
                url: "",
                title: "",
                price: "",
                img: "",
                distributor: "maxiconsumo",
                product: "fruitsVegetables"
            },
            cleaning: await maxiconsumoTemplate("limpieza","cleaning"),
            pets: await maxiconsumoTemplate("mascotas","pets")
        }
    }
}

module.exports = {
    allMaxiconsumoData
}