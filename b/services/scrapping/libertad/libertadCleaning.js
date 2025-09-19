const axios = require("axios");
const { inferProductType } = require("../productType");

exports.libertadCleaning = async () => {
  try {
    const chunkSize = 50;
    let from = 0;
    const seenIds = new Set();
    const allProducts = [];
    const slug = 'limpieza'

    while (true) {
      let to = from + chunkSize - 1;
      const url = `https://www.hiperlibertad.com.ar/api/catalog_system/pub/products/search/${slug}?_from=${from}&_to=${to}`;
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (!Array.isArray(data) || data.length === 0) {
        console.log("🔚 Fin de productos detectado");
        break;
      }

      for (const product of data) {
        const item = product.items?.[0];
        const price = item?.sellers?.[0]?.commertialOffer?.Price;
        const img = item?.images?.[0]?.imageUrl;
        const title = product.productName;
        const url = product.link;

        if (!seenIds.has(product.productId) && price && img && title) {
          seenIds.add(product.productId);
          allProducts.push({
            title,
            price,
            img,
            url,
            distributor: "libertad",
            product: inferProductType(title, 'cleaning')
          });
        }
      }

      console.log(`📥 Obtenidos ${allProducts.length} productos hasta ahora`);
      from += chunkSize;
      await new Promise(res => setTimeout(res, 800)); // Delay
    }

    console.log(`✅ Libertad limpieza: ${allProducts.length} productos obtenidos`);
    return allProducts;

  } catch (err) {
    console.error("Error en libertadStore limpieza:", err.message);
    return [];
  }
};
