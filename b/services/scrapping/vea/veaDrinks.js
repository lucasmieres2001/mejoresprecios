const axios = require('axios');

exports.veaDrinks = async () => {
  const url = 'https://www.vea.com.ar/_v/private/graphql/v1'; // ✅ correcto
  const allProducts = [];
  const pageSize = 50;
  let total = 0;


  const initialBody = {
    operationName: "productSearchV3", // ⚠️ debería ser "productSearchV3" según el hash que estás usando
    variables: {
      fullText: "bebidas",
      from: 0,
      to: pageSize - 1,
      selectedFacets: [{ key: "c", value: "bebidas" }],
      orderBy: "OrderByScoreDESC"
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

  // ✅ Enviar primera solicitud
  const initialRes = await axios.post(url, initialBody, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const search = initialRes.data?.data?.productSearch;
  total = search?.recordsFiltered || 0;
  allProducts.push(...(search?.products || []));

  // 🔁 Paginación automática
  for (let from = pageSize; from < total; from += pageSize) {
    const to = Math.min(from + pageSize - 1, total - 1);

    const pagedBody = {
      ...initialBody,
      variables: {
        ...initialBody.variables,
        from,
        to
      }
    };

    const res = await axios.post(url, pagedBody, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const pageProducts = res.data?.data?.productSearch?.products || [];
    allProducts.push(...pageProducts);
  }

  // ✅ Formatear productos
  const list = allProducts.map(p => {
    const title = p.productName;
    const price = p.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
    const img = p.items?.[0]?.images?.[0]?.imageUrl;
    const distributor = "vea";
    const product = inferProductType(title,'drinks')
    return { title, price, img ,distributor, product};
  });

  return list;
};
