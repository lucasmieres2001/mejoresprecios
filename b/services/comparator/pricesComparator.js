const stringSimilarity = require("string-similarity");

// Función para normalizar strings
const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9\s]/g, "") // quita símbolos
    .replace(/\s+/g, " ") // colapsa espacios
    .trim();
};

// Extrae info de cantidad (ej: 1l, 500g, 200 grs)
const extractQuantity = (title) => {
  const qtyRegex = /(\d+(\.\d+)?\s?(kg|g|grs?|ml|lt?|l))/i;
  const match = title.match(qtyRegex);
  return match ? normalize(match[0]) : "";
};

// Compara marcas con similitud difusa
const areSimilar = (a, b, threshold = 0.8) => {
  return stringSimilarity.compareTwoStrings(normalize(a), normalize(b)) >= threshold;
};

exports.pricesComparator = (productList) => {
  let flatProducts = [];

  // Paso 1: "aplastamos" el JSON de supermercados en un solo array
  productList.forEach(market => {
  const marketName = Object.keys(market)[0];
  const categories = market[marketName];

  Object.keys(categories).forEach(cat => {
    const items = categories[cat];
    if (Array.isArray(items)) {
      items.forEach(item => flatProducts.push(item));
      }
    });
  });


  // Paso 2: Agrupamos por similitud
  let grouped = {};

  flatProducts.forEach(prod => {
    const qty = extractQuantity(prod.title);
    const words = prod.title.split(" ");
    const possibleBrand = words[1] || ""; // simplificación inicial

    // buscamos si ya existe un grupo con mismo producto + cantidad + marca similar
    let foundKey = null;
    for (let key in grouped) {
      const [prodType, brand, gQty] = key.split("_");
      if (
        prodType === normalize(prod.product) &&
        gQty === qty &&
        areSimilar(possibleBrand, brand)
      ) {
        foundKey = key;
        break;
      }
    }

    // si no existe, creamos un nuevo grupo
    if (!foundKey) {
      foundKey = `${normalize(prod.product)}_${normalize(possibleBrand)}_${qty}`;
      grouped[foundKey] = [];
    }

    grouped[foundKey].push(prod);
  });

  // Paso 3: Para cada grupo, elegimos el más barato (o todos si hay empate exacto)
  let result = [];
  Object.values(grouped).forEach(group => {
    group.sort((a, b) => a.price - b.price);
    const cheapest = group[0].price;

    // incluir todos con precio == cheapest
    const cheapestProducts = group.filter(p => p.price === cheapest);
    result.push(...cheapestProducts);
  });

  return result;
};
