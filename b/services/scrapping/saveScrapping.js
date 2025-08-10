const Product = require('../../models/product'); // Importa el modelo Product scripeado

exports.saveScrapeProduct = async (save) => {
  
  try {
    await Product.create({
      url: save.url,
      title: save.title,
      price: save.price,
      img: save.img || null,
    });
    return {
      url: save.url,
      title: save.title,
      price: save.price,
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}