const axios = require('axios');
const { inferProductType } = require('../productType');

exports.mamiCleaning = async () => {
  const pageSize = 96;
  let offset = 0;
  let productos = [];

  let slug = "limpieza";
  let code = "N-1ceauru";
  let type = "cleaning";

  while (true) {
    const url = `https://www.dinoonline.com.ar/super/categoria/supermami-${slug}/_/${code}?Nf=product.endDate|GTEQ+1.755216E12||product.startDate|LTEQ+1.755216E12&Nr=AND(product.disponible%3ADisponible%2Cproduct.language%3Aespa%C3%B1ol%2Cproduct.priceListPair%3AsalePrices_listPrices%2COR(product.siteId%3AsuperSite))&No=${offset}&Nrpp=${pageSize}&format=json`;

    const { data } = await axios.get(url);

    // Extraemos la lista de productos
    const records = data?.contents
      ?.flatMap(c => c.MainContent || [])
      ?.flatMap(mc => mc.contents || [])
      ?.flatMap(c2 => c2.records || []) || [];

    // Si no hay registros, cortamos el bucle
    if (records.length === 0) break;

    for (const productRecord of records) {
      const title = productRecord?.attributes?.['product.displayName']?.[0];
      const price = productRecord?.attributes?.['product.salePrice']?.[0];
      const img = productRecord?.attributes?.['product.image']?.[0];
      
      let link = null;
      const rawLink = productRecord?.detailsAction?.recordState;
      if (rawLink) {
        link = `https://www.dinoonline.com.ar${rawLink.replace('?format=json', '')}`;
      }

      productos.push({
        title,
        price,
        img: img ? `https:${img}` : null,
        url: link,
        distributor: 'mami',
        product: inferProductType(title, type),
      });
    }

    offset += pageSize;
  }

  return productos;
};
