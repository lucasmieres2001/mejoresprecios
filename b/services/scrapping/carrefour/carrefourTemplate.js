const axios = require("axios");
const { inferProductType } = require("../productType");

exports.carrefourTemplate = async (slug, tipo) => {
  const dominio = "https://www.carrefour.com.ar";
  const distribuidor = "carrefour";
  try {
    const chunkSize = 50;
    let from = 0;
    const seenIds = new Set();
    const allProducts = [];
    const maxProducts = 2000; // Límite de seguridad
    const maxFrom = 2500;

    while (from <= maxFrom && allProducts.length < maxProducts) {
      let to = Math.min(from + chunkSize - 1, maxFrom);
      const ruta = `${dominio}/api/catalog_system/pub/products/search/${slug}?_from=${from}&_to=${to}`;
      try {
        const { data } = await axios.get(ruta, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!Array.isArray(data) || data.length === 0) {
          console.log("🔚 Fin de productos detectado");
          break;
        }

        let nuevos = 0;
        for (const product of data) {
          const item = product.items?.[0];
          const commertialOffer = item?.sellers?.[0]?.commertialOffer;
          
          // VERIFICAR STOCK - esta es la clave
          const availableQuantity = commertialOffer?.AvailableQuantity;
          const isAvailable = commertialOffer?.IsAvailable;
          
          // Solo procesar productos con stock disponible
          if (!availableQuantity || availableQuantity <= 0 || !isAvailable) {
            continue; // Saltar productos sin stock
          }

          let price = commertialOffer?.Price;
          if (
            commertialOffer?.PriceWithoutDiscount &&
            commertialOffer.PriceWithoutDiscount < commertialOffer.Price
          ) {
            price = commertialOffer.PriceWithoutDiscount;
          }
          const img = item?.images?.[0]?.imageUrl;
          const title = product.productName;

          // Capturar tipo de descuento si existe
          let discountType = null;
          if (commertialOffer?.DiscountHighLight?.length) {
            const raw = commertialOffer.DiscountHighLight[0];
            if (typeof raw === "object" && raw["<Name>k__BackingField"]) {
              discountType = raw["<Name>k__BackingField"];
            } else if (typeof raw === "string") {
              discountType = raw;
            }
          }
          if (commertialOffer?.teasers?.length) {
            discountType = commertialOffer.teasers[0]?.name || commertialOffer.teasers[0]?.description || discountType;
          }

          if (!seenIds.has(product.productId) && price && img && title) {
            seenIds.add(product.productId);
            allProducts.push({
              title,
              price,
              discountType,
              img,
              url: `${dominio}/${product.linkText}/p`,
              distributor: distribuidor,
              product: inferProductType(title, tipo),
              stock: availableQuantity // Opcional: incluir cantidad de stock
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

        console.log(`📥 Obtenidos ${allProducts.length} productos de ${distribuidor} "${tipo}" hasta ahora`);
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

    console.log(`✅ ${distribuidor} ${tipo}: ${allProducts.length} productos con stock obtenidos`);
    return allProducts;

  } catch (err) {
    console.error(`Error en ${distribuidor} ${tipo}:`, err.message);
    return [];
  }
};