const axios = require('axios');
const { inferProductType } = require('../productType');

exports.carrefourStore = async () => {
  const ruta = 'https://www.carrefour.com.ar/_v/segment/graphql/v1';

  const allProducts = [];
  const pageSize = 50; // número máximo que VTEX soporta sin errores
  let total = 0;

  try {
    // Hacemos primero un request para saber cuántos productos hay
    const initialBody = {
      operationName: "productSearchV3",
      variables: {
        hideUnavailableItems: true,
        skusFilter: "ALL_AVAILABLE",
        simulationBehavior: "default",
        installationCriteria: "MAX_WITHOUT_INTEREST",
        productOriginVtex: false,
        map: "c",
        query: "almacen",
        orderBy: "OrderByScoreDESC",
        from: 0,
        to: pageSize - 1,
        selectedFacets: [
          { key: "c", value: "almacen" }
        ],
        facetsBehavior: "Static",
        categoryTreeBehavior: "default",
        withFacets: false,
        variant: "null-null",
        advertisementOptions: {
          showSponsored: true,
          sponsoredCount: 3,
          advertisementPlacement: "top_search",
          repeatSponsoredProducts: true
        }
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "c351315ecde7f473587b710ac8b97f147ac0ac0cd3060c27c695843a72fd3903",
          sender: "vtex.store-resources@0.x",
          provider: "vtex.search-graphql@0.x"
        }
      }
    };

    const initialResponse = await axios.post(ruta, initialBody, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    total = initialResponse.data?.data?.productSearch?.recordsFiltered || 0;

    // Agregar productos de la primera página
    const firstBatch = initialResponse.data?.data?.productSearch?.products || [];
    allProducts.push(...firstBatch);

    // Cargar el resto paginado
    for (let from = pageSize; from < total; from += pageSize) {
      const to = from + pageSize - 1;

      const pagedBody = {
        ...initialBody,
        variables: {
          ...initialBody.variables,
          from,
          to
        }
      };

      const pageResponse = await axios.post(ruta, pagedBody, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const pageProducts = pageResponse.data?.data?.productSearch?.products || [];
      allProducts.push(...pageProducts);
    }

    // Transformar a formato { title, price, img }
    const storeList = allProducts.map(products => {
      const url = products.link;
      const title = products.productName?.trim();
      const price = products.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
      const img = products.items?.[0]?.images?.[0]?.imageUrl;
      const distributor = 'carrefour';
      const product = inferProductType(title,"store")
      return { title, price, img, distributor, product, url };
    }).filter(p => p.title && p.price && p.img && p.product);

   // console.log('Productos de Carrefour obtenidos:', storeList);
    console.log(`Cantidad de productos de almacen: ${storeList.length} / ${total}`);

    return { almacen: storeList };

  } catch (error) {
    console.error('Error fetching Carrefour products:', error.message);
    throw error;
  }
};
