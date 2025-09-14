const { makroTemplate } =  require("./makroTemplate");

async function allMakroData() {
    return { 
        makro: {
            dairy: await makroTemplate('CP_17'),
            drinks: await makroTemplate('CP_03'),
            store: await makroTemplate('CP_12'),
            meats: await makroTemplate('CP_04'),
            fruitsVegetables: await makroTemplate('CP_15'),
            cleaning: await makroTemplate('CP_02'),
            pets: await makroTemplate('CP_18')
        }
    };
};

module.exports = {
    allMakroData
};
