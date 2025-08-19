const jsonPrueba = require('./N-1500t13.json');
//PARA SOLUCIONAR LA URL USA 3520014
/**
 * @typedef {Object} Product
 * @property {string} url - La URL del producto.
 * @property {string} title - El título del producto.
 * @property {string} price - El precio del producto.
 * @property {string} img - La URL de la imagen del producto.
 * @property {string} distributor - El distribuidor, que es "mami".
 */

/**
 * Procesa datos de productos desde un archivo JSON local.
 * @returns {Product[]} Un array de objetos de productos.
 */
exports.mamiStore = () => {
  // La ruta de los registros de productos es contents[0].MainCategoryContentN[3].records
  const products = jsonPrueba.contents?.[0]?.MainCategoryContentN?.[3]?.records || [];

  const formattedData = products.map(product => {
    // Extrae la información necesaria del objeto product
    const title = product.attributes['product.displayName']?.[0];
    const price = product.attributes['sku.activePrice']?.[0];
    const productUrl = product.detailsAction.recordState?.[0] //productRecord?.detailsAction?.recordState
    const imageUrl = product.attributes['product.mediumImage.url']?.[0]

    // Construye las URLs completas (el host se asume en este caso)
    const fullUrl = `https://www.dinoonline.com.ar${productUrl}`;
    const fullImg = `${imageUrl}`;
    let test = {
      url: fullUrl,
      title: title,
      price: price,
      img: fullImg,
      distributor: "mami",
    }
    console.log(test)
    return {
      url: fullUrl,
      title: title,
      price: price,
      img: fullImg,
      distributor: "mami",
    };
  }).filter(item => item.title && item.price && item.url && item.img);

  return formattedData;
};