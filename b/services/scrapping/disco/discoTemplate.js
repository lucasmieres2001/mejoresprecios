const axios = require("axios");
const { inferProductType } = require("../productType");

exports.discoTemplate = async (type, categoryId) => {
  try {
    const chunkSize = 50;
    let from = 0;
    const seenIds = new Set();
    const allProducts = [];

    let emptyRounds = 0; // contador de iteraciones vacías

    while (true) {
      let to = from + chunkSize - 1;
      
      // Configuración de la petición GraphQL
      const graphqlUrl = 'https://www.disco.com.ar/_v/segment/graphql/v1?workspace=master&maxAge=short&appsEtag=remove&domain=store&locale=es-AR';
      
      const graphqlData = {
        operationName: "productSearchV3",
        variables: {
          query: "",
          orderBy: "OrderByScoreDESC",
          map: "c",
          from: from,
          to: to,
          hideUnavailableItems: true,
          selectedFacets: [{ key: "c", value: categoryId }],
          withFacets: false,
          simulationBehavior: "default",
          installmentCriteria: "MAX_WITHOUT_INTEREST",
          productOriginVtex: false,
          facetsBehavior: "Static",
          categoryTreeBehavior: "default"
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

      const { data } = await axios.post(graphqlUrl, graphqlData, {
        headers: { 
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/json"
        },
      });

      // Acceder a los productos desde data.data.productSearch.products
      const products = data?.data?.productSearch?.products || [];
      const totalProducts = data?.data?.productSearch?.recordsFiltered || 0;

      if (!Array.isArray(products) || products.length === 0) {
        console.log("🔚 Fin de productos detectado (API vacía)");
        break;
      }

      // Log del progreso
      console.log(`📊 Obteniendo productos ${from + 1}-${Math.min(to + 1, totalProducts)} de ${totalProducts}`);

      let nuevos = 0;
      for (const product of products) {
        const item = product.items?.[0];
        const price = item?.sellers?.[0]?.commertialOffer?.Price;
        const img = item?.images?.[0]?.imageUrl;
        const title = product.productName;
        const url = "https://www.disco.com.ar"+ product.link;
        const productId = product.productId;

        if (!seenIds.has(productId) && price && img && title) {
          seenIds.add(productId);
          allProducts.push({
            url,
            title,
            price,
            img,
            distributor: "disco",
            product: inferProductType(title, `${type}`),
          });
          nuevos++;
        }
      }

      if (nuevos === 0) {
        emptyRounds++;
        console.log(`⚠️ Iteración sin productos nuevos (${emptyRounds}/3)`);
        if (emptyRounds >= 3) {
          console.log("🔚 Fin de productos detectado (demasiados repetidos)");
          break;
        }
      } else {
        emptyRounds = 0; // reset si en esta tanda hubo nuevos
      }

      console.log(
        `📥 Obtenidos ${allProducts.length} productos de ${type} hasta ahora`
      );

      // Verificar si hemos llegado al final
      if (to >= totalProducts - 1) {
        console.log("🔚 Fin de productos detectado (límite total alcanzado)");
        break;
      }

      from += chunkSize;
      await new Promise((res) => setTimeout(res, 800)); // Delay
    }

    console.log(`✅ Disco "${type}": ${allProducts.length} productos obtenidos`);
    return allProducts;
  } catch (err) {
    console.error(`Error en Disco "${type}":`, err.message);
    if (err.response) {
      console.error("Detalles del error:", err.response.data);
    }
    return [];
  }
};