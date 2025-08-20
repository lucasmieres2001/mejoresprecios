const axios = require('axios');
const { inferProductType } = require('../productType');

// Función auxiliar para encontrar records en cualquier MainCategoryContentN
function extractRecords(data) {
  const sections = data?.contents?.[0]?.MainCategoryContentN || [];
  for (const section of sections) {
    if (Array.isArray(section.records) && section.records.length > 0) {
      return section.records;
    }
  }
  return [];
}

exports.mamiDairy = async () => {
  const pageSize = 16;
  let offset = 0;
  let productos = [];
  let slug = "fresco-lacteos";
  let code = "N-77sm4g";
  let type = "dairy";

  while (true) {
    const url = `https://www.dinoonline.com.ar/super/categoria/supermami-${slug}/_/${code}?Nf=product.endDate|GTEQ+1.755216E12||product.startDate|LTEQ+1.755216E12&Nr=AND(product.disponible%3ADisponible%2Cproduct.language%3Aespa%C3%B1ol%2Cproduct.priceListPair%3AsalePrices_listPrices%2COR(product.siteId%3AsuperSite))&No=${offset}&Nrpp=${pageSize}&format=json`;

    console.log(`📄 Scrapeando página (offset: ${offset})`);

    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Referer': 'https://www.dinoonline.com.ar/',
          'Accept-Language': 'es-AR,es;q=0.9',
          'Accept': 'application/json'
        }
      });

      const records = extractRecords(res.data);

      if (records.length === 0) {
        console.log(`✅ No hay más records en offset ${offset}. Cortando loop.`);
        break;
      }

      for (const productRecord of records) {
        if (!productRecord?.attributes) continue;

        const product = productRecord.attributes;
        const title = product?.['product.displayName']?.[0] || 'Sin título';
        const img = product?.['product.mediumImage.url']?.[0];
        const dtoPriceRaw = product?.['sku.dtoPrice']?.[0];

        // Tomar la URL desde detailsAction
        let link = null;
        const rawLink = productRecord?.detailsAction?.recordState;
        if (rawLink) {
          link = `https://www.dinoonline.com.ar/super/producto${rawLink.replace('?format=json', '')}`;
        }

        let price = null;
        try {
          const parsedDto = JSON.parse(dtoPriceRaw);
          price = parsedDto?.precioLista || parsedDto?.precio;
        } catch (e) {
          price = parseFloat(product?.['sku.activePrice']?.[0]) || null;
        }

        productos.push({
          title,
          price,
          img,
          url: link,
          distributor: 'mami',
          product: inferProductType(title, type)
        });
      }

      offset += pageSize;

    } catch (error) {
      console.error('❌ Error '+slug+' al obtener productos de mami:', error.message);
      break;
    }
  }

  console.log(`🔍 Total ${slug} productos obtenidos de mami: ${productos.length}`);
  return productos;
};
