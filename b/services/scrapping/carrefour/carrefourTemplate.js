const axios = require("axios");
const { inferProductType } = require("../productType");

exports.carrefourTemplate = async (slug, tipo) => {
  try {
    const chunkSize = 50;
    let from = 0;
    const seenIds = new Set();
    const allProducts = [];
    const maxProducts = 2000; // Límite de seguridad
    const maxFrom = 2500;

    while (from <= maxFrom && allProducts.length < maxProducts) {
      let to = Math.min(from + chunkSize - 1, maxFrom);
      const url = `https://www.carrefour.com.ar/api/catalog_system/pub/products/search/${slug}?_from=${from}&_to=${to}`;
      try {
        const { data } = await axios.get(url, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!Array.isArray(data) || data.length === 0) {
          console.log("🔚 Fin de productos detectado");
          break;
        }

        let nuevos = 0;
        for (const product of data) {
          const item = product.items?.[0];
          const price = item?.sellers?.[0]?.commertialOffer?.Price;
          const img = item?.images?.[0]?.imageUrl;
          const title = product.productName;

          if (!seenIds.has(product.productId) && price && img && title) {
            seenIds.add(product.productId);
            allProducts.push({
              title,
              price,
              img,
              distributor: "carrefour",
              product: inferProductType(title, tipo)
            });
            nuevos++;
          }
        }

        // Si no se agregó ningún producto nuevo, significa que la API está repitiendo productos
        if (nuevos === 0) {
          console.log("🔁 Todos los productos de esta página ya fueron vistos. Cortando paginación.");
          break;
        }

        // Si la respuesta trae menos productos que chunkSize, ya no hay más
        if (data.length < chunkSize) {
          console.log("🔚 Última página de productos recibida");
          break;
        }

        console.log(`📥 Obtenidos ${allProducts.length} productos de Carrefour "${tipo}" hasta ahora`);
        from += chunkSize;
        await new Promise(res => setTimeout(res, 800)); // Delay
      } catch (err) {
        if (err.response) {
          console.error("❌ Error HTTP", err.response.status);
          console.error("Headers:", err.response.headers);
          console.error("Body:", err.response.data);
        } else {
          console.error("❌ Error:", err.message);
        }
        break;
      }
    }

    console.log(`✅ Carrefour ${tipo}: ${allProducts.length} productos obtenidos`);
    return allProducts;

  } catch (err) {
    console.error(`Error en Carrefour ${tipo}:`, err.message);
    return [];
  }
};
