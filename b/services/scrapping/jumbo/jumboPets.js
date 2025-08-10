const axios = require('axios');
const { inferProductType } = require('../productType');

exports.jumboPets = async () => {
  const url = 'https://www.jumbo.com.ar/_v/segment/graphql/v1?workspace=master&maxAge=short&appsEtag=remove&domain=store&locale=es-AR&__bindingId=4780db52-b885-45f0-bbcc-8bf212bb8427';
  const allProducts = [];
  const seenIds = new Set(); // Para evitar duplicados
  const pageSize = 20;
  const maxBlockSize = 1000;

  const baseBody = {
    operationName: "productSearchV3",
    variables: {
      query: "mascotas",
      orderBy: "OrderByScoreDESC",
      map: "c",
      from: 0,
      to: pageSize - 1,
      hideUnavailableItems: true,
      simulationBehavior: "default",
      installmentCriteria: "MAX_WITHOUT_INTEREST",
      productOriginVtex: false,
      selectedFacets: [{ key: "c", value: "mascotas" }],
      facetsBehavior: "Static",
      categoryTreeBehavior: "default",
      withFacets: false,
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

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  };

  let from = 0;
  let keepFetching = true;

  while (keepFetching) {
    console.log(`📦 Iniciando bloque desde ${from} hasta ${from + maxBlockSize}`);

    for (let offset = from; offset < from + maxBlockSize; offset += pageSize) {
      const to = offset + pageSize - 1;

      const body = {
        ...baseBody,
        variables: {
          ...baseBody.variables,
          from: offset,
          to
        }
      };

      try {
        const res = await axios.post(url, body, { headers });
        const pageProducts = res.data?.data?.productSearch?.products || [];

        if (pageProducts.length === 0) {
          console.log(`✅ Fin anticipado: sin más productos en offset ${offset}`);
          keepFetching = false;
          break;
        }

        // Evitar duplicados
        const newProducts = pageProducts.filter(p => {
          if (seenIds.has(p.productId)) return false;
          seenIds.add(p.productId);
          return true;
        });

        allProducts.push(...newProducts);
        console.log(`➕ Agregados ${newProducts.length} productos únicos (offset ${offset})`);
      } catch (err) {
        console.error(`❌ Error al obtener productos (offset=${offset}):`, err?.response?.status || err.message);
        keepFetching = false;
        break;
      }
    }

    from += maxBlockSize;
  }

  // ✅ Formato final
  const list = allProducts.map(p => {
    const title = p.productName;
    const price = p.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
    const img = p.items?.[0]?.images?.[0]?.imageUrl;
    return {
      title,
      price,
      img,
      distributor: 'jumbo',
      product: inferProductType(title, "pets")
    };
  });

  console.log(`🔍 Total productos únicos JUMBO (Mascotas): ${list.length}`);
  return list;
};
