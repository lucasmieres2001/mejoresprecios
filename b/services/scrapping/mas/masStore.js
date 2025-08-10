const axios = require('axios');
const { inferProductType } = require('../productType');

// Configuración optimizada
const MAX_RETRIES = 3;
const DELAY_BETWEEN_REQUESTS = 800; // Reducido a 800ms
const CHUNK_SIZE = 50; // Aumentado a 50
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const MAX_SESSIONS = 10; // Aumentado a 10 sesiones
const REAL_TOTAL_PRODUCTS = 2500; // Valor real conocido

// Función para procesar productos
function processChunk(data, seenIds) {
  const results = [];
  
  for (const product of data) {
    try {
      const item = product.items?.[0];
      if (!item) continue;

      const price = item?.sellers?.[0]?.commertialOffer?.Price;
      const img = item?.images?.[0]?.imageUrl;
      const title = product.productName?.trim();
      const productId = product.productId;

      if (!productId || seenIds.has(productId)) continue;
      if (!price || !img || !title) continue;

      seenIds.add(productId);
      results.push({
        title,
        price,
        img,
        distributor: "mas",
        product: inferProductType(title, 'store')
      });
    } catch (e) {
      console.warn(`⚠️ Error procesando producto: ${e.message}`);
    }
  }
  return results;
}

// Delay con variabilidad aleatoria
const delay = (ms, attempt = 0) => {
  const jitter = Math.floor(Math.random() * 300) - 150; // ±150ms
  const delayTime = Math.max(500, ms + jitter); // Mínimo 500ms
  console.log(`⌛ Esperando ${delayTime}ms (intento ${attempt})...`);
  return new Promise(res => setTimeout(res, delayTime));
};

// Cliente HTTP mejorado
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

exports.masStore = async () => {
  const categoryId = 3454; // Almacén
  let allProducts = [];
  let seenIds = new Set();
  let from = 0;
  let sessionCounter = 0;
  let lastSuccessfulChunkSize = CHUNK_SIZE;

  try {
    while (sessionCounter < MAX_SESSIONS && allProducts.length < REAL_TOTAL_PRODUCTS) {
      console.log(`🚀 Iniciando sesión ${sessionCounter + 1}`);
      let sessionProducts = 0;
      let attempts = 0;
      let sessionActive = true;

      while (sessionActive && allProducts.length < REAL_TOTAL_PRODUCTS) {
        const to = from + lastSuccessfulChunkSize - 1;
        const url = `https://www.masonline.com.ar/api/catalog_system/pub/products/search/?fq=productClusterIds:${categoryId}&_from=${from}&_to=${to}`;
        
        try {
          const { data } = await httpClient.get(url);
          
          if (!Array.isArray(data)) {
            throw new Error('Respuesta no es un array');
          }

          const processed = processChunk(data, seenIds);
          
          if (processed.length === 0) {
            if (attempts < 2 && data.length > 0) {
              // Reducir tamaño de chunk si falla pero hay datos
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
          lastSuccessfulChunkSize = CHUNK_SIZE; // Resetear al tamaño original
          
          console.log(`📥 Obtenidos ${processed.length} productos (sesión: ${sessionProducts}, total: ${allProducts.length})`);

          // Actualizar progreso
          const progress = ((allProducts.length / REAL_TOTAL_PRODUCTS) * 100).toFixed(1);
          console.log(`📊 Progreso: ${progress}%`);

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
      
      // Solo reiniciar si no hemos alcanzado el total
      if (allProducts.length < REAL_TOTAL_PRODUCTS) {
        const nextDelay = 3000 + (sessionCounter * 2000);
        console.log(`🔄 Preparando nueva sesión en ${nextDelay}ms...`);
        await delay(nextDelay);
        
        // Rotar User-Agent y resetear seenIds
        seenIds = new Set(allProducts.map(p => p.id));
        httpClient.defaults.headers['User-Agent'] = `${USER_AGENT} Session/${sessionCounter}`;
      }
    }

    console.log(`✅ Masonline: ${allProducts.length} productos obtenidos en ${sessionCounter} sesiones`);
    return allProducts;

  } catch (err) {
    console.error("Error crítico en masStore:", err.message);
    return allProducts;
  }
};