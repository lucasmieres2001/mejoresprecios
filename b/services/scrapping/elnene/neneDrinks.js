// services/scrapping/nene/neneStore.js
const axios = require('axios');
const { inferProductType } = require('../productType');

// Configuración
const MAX_RETRIES = 3;
const DELAY_BETWEEN_REQUESTS = 800;
const CHUNK_SIZE = 50;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const MAX_SESSIONS = 2;
const REAL_TOTAL_PRODUCTS = 2500; // Valor máximo posible en VTEX (se corta antes si el JSON tiene menos)

// Procesar cada chunk
function processChunk(data, seenIds, filter_data) {
  const results = [];
  for (const product of data) {
    try {
      if (!product || !product.productId) continue;
      const item = product.items?.[0];
      const price = item?.sellers?.[0]?.commertialOffer?.Price;
      const img = item?.images?.[0]?.imageUrl;
      const title = product.productName?.trim();
      const link = product.link || product.linkText;
      if (!price || !img || !title || !link) continue;
      if (seenIds.has(product.productId)) continue;

      seenIds.add(product.productId);
      results.push({
        url: link.startsWith('http') ? link : `https://www.grupoelnene.com.ar${link}`,
        title,
        price,
        img,
        distributor: 'elnene',
        product: inferProductType(title, filter_data)
      });
    } catch (err) {
      console.warn(`⚠️ Error procesando producto: ${err.message}`);
    }
  }
  return results;
}

// Delay con jitter
const delay = (ms, attempt = 0) => {
  const jitter = Math.floor(Math.random() * 300) - 150;
  const delayTime = Math.max(500, ms + jitter);
  console.log(`⌛ Esperando ${delayTime}ms (intento ${attempt})...`);
  return new Promise(res => setTimeout(res, delayTime));
};

// Cliente HTTP con reintentos
const httpClient = axios.create({
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json',
    'Accept-Language': 'es-AR,es;q=0.9'
  },
  timeout: 15000
});

httpClient.interceptors.response.use(null, async (error) => {
  const config = error.config;
  config.retryCount = config.retryCount || 0;
  if (config.retryCount < MAX_RETRIES) {
    config.retryCount++;
    await delay(DELAY_BETWEEN_REQUESTS * config.retryCount * 2, config.retryCount);
    return httpClient(config);
  }
  return Promise.reject(error);
});

// Función genérica para scrapear un slug específico
async function scrapeSlug(slug_data, filter_data) {
  let allProducts = [];
  let seenIds = new Set();
  let from = 0;
  let sessionCounter = 0;
  let lastSuccessfulChunkSize = CHUNK_SIZE;

  while (sessionCounter < MAX_SESSIONS && allProducts.length < REAL_TOTAL_PRODUCTS) {
    console.log(`🚀 Iniciando sesión ${sessionCounter + 1} para slug: ${slug_data}`);
    let sessionProducts = 0;
    let attempts = 0;
    let sessionActive = true;

    while (sessionActive && allProducts.length < REAL_TOTAL_PRODUCTS) {
      const to = from + lastSuccessfulChunkSize - 1;
      const url = `https://www.grupoelnene.com.ar/api/catalog_system/pub/products/search/${slug_data}?_from=${from}&_to=${to}`;

      try {
        const { data } = await httpClient.get(url);
        if (!Array.isArray(data)) throw new Error('Respuesta no es un array');

        const processed = processChunk(data, seenIds, filter_data);

        if (processed.length === 0) {
          if (attempts < 2 && data.length > 0) {
            lastSuccessfulChunkSize = Math.max(10, Math.floor(lastSuccessfulChunkSize * 0.7));
            console.log(`🔄 Reduciendo chunk size a ${lastSuccessfulChunkSize}`);
            attempts++;
            continue;
          }
          console.log('🛑 No se pudieron procesar más productos');
          sessionActive = false;
          break;
        }

        allProducts.push(...processed);
        from += processed.length;
        sessionProducts += processed.length;
        lastSuccessfulChunkSize = CHUNK_SIZE;

        console.log(`📥 Obtenidos ${processed.length} productos (sesión: ${sessionProducts}, total: ${allProducts.length})`);
        await delay(DELAY_BETWEEN_REQUESTS);

      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('🔍 404 detectado - fin de productos');
          sessionActive = false;
        } else if (error.response && error.response.status === 429) {
          console.warn('⚠️ Demasiadas solicitudes - reiniciando sesión');
          sessionActive = false;
        } else {
          console.error(`❌ Error en petición: ${error.message}`);
          if (++attempts >= 2) sessionActive = false;
        }
      }
    }

    sessionCounter++;
    if (allProducts.length < REAL_TOTAL_PRODUCTS) {
      const nextDelay = 3000 + (sessionCounter * 2000);
      console.log(`🔄 Preparando nueva sesión en ${nextDelay}ms...`);
      await delay(nextDelay);
      seenIds = new Set(allProducts.map(p => p.id));
      httpClient.defaults.headers['User-Agent'] = `${USER_AGENT} Session/${sessionCounter}`;
    }
  }

  console.log(`✅ ${slug_data}: ${allProducts.length} productos obtenidos en ${sessionCounter} sesiones`);
  return allProducts;
}

// Función principal que une todo
exports.neneDrinks = async () => {
  const slugs = [
    { slug: 'bebidas-sin-alcohol', filter: 'drinks' },
    { slug: 'bebidas-con-alcohol', filter: 'drinks' },
    { slug: 'vinos', filter: 'drinks' }
  ];

  let results = [];
  for (const { slug, filter } of slugs) {
    const products = await scrapeSlug(slug, filter);
    results.push(...products);
  }

  // Evitar duplicados finales por productId
  const unique = [];
  const seen = new Set();
  for (const p of results) {
    if (!seen.has(p.url)) {
      seen.add(p.url);
      unique.push(p);
    }
  }

  console.log(`✅ Total combinado (sin duplicados): ${unique.length} productos`);
  return unique;
};
