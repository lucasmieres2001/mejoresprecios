

const axios = require('axios');
const { inferProductType } = require('../productType');

exports.cotoStore = async () => {
  const pageSize = 96;
  let offset = 0;
  let productos = [];

  while (true) {
    const url = `https://www.cotodigital.com.ar/sitios/cdigi/categoria/catalogo-almac%C3%A9n/_/N-nityfw?Nf=product.endDate%7CGTEQ%201.7545248E12%7C%7Cproduct.startDate%7CLTEQ%201.7545248E12&Nr=AND(product.sDisp_200:1004,product.language:espa%C3%B1ol,OR(product.siteId:CotoDigital))&No=${offset}&Nrpp=${pageSize}&format=json`;

    console.log(`📄 Scrapeando página (offset: ${offset})`);

    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Referer': 'https://www.cotodigital.com.ar/',
          'Accept-Language': 'es-AR,es;q=0.9',
          'Accept': 'application/json'
        }
      });

      const contents = res.data.contents || [];
      let foundProducts = false;
      let foundAnyRecords = false;

      for (const content of contents) {
        const main = content.Main || [];

        for (const section of main) {
          if (
            Array.isArray(section.contents) &&
            section.templateTypes?.includes("MainLandingPage")
          ) {
            const resultList = section.contents.find(c => c["@type"] === "Category_ResultsList");
            const records = resultList?.records || [];

            if (records.length > 0) {
              foundAnyRecords = true;
            }

            for (const productGroup of records) {
              const groupRecords = productGroup.records || [];

              for (const productRecord of groupRecords) {
                if (!productRecord?.attributes) continue;

                const product = productRecord.attributes;
                const title = product?.['product.displayName']?.[0] || 'Sin título';
                const img = product?.['product.mediumImage.url']?.[0];
                const dtoPriceRaw = product?.['sku.dtoPrice']?.[0];

                // Tomar la URL desde detailsAction
                let link = null;
                const rawLink = productRecord?.detailsAction?.recordState;
                if (rawLink) {
                  link = `https://www.cotodigital.com.ar/sitios/cdigi/productos${rawLink.replace('?format=json', '')}`;
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
                  distributor: 'coto',
                  product: inferProductType(title, 'store')
                });

                foundProducts = true;
              }
            }
          }
        }
      }

      if (!foundAnyRecords) {
        console.log(`✅ No hay más records. Cortando antes del error 500 en offset ${offset}.`);
        break;
      }

      if (!foundProducts) {
        console.log('✅ Fin de ALMACEN. No hay más productos.');
        break;
      }

      offset += pageSize;

    } catch (error) {
      console.error('❌ Error ALMACEN al obtener productos de Coto:', error.message);
      break;
    }
  }

  console.log(`🔍 Total ALMACEN productos obtenidos de Coto: ${productos.length}`);
  return productos;
};
