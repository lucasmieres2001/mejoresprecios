// services/scrapping/modelo/modeloStore.js
const axios = require("axios");
const { inferProductType } = require("../productType");

// Delay para evitar baneos
const delay = (ms) => new Promise(res => setTimeout(res, ms));

exports.modeloFruitsVegetables = async () => {
  try {
    const seenIds = new Set();
    const allProducts = [];

    // 🔹 Categoría a scrapear (slug encontrado en la web)
    const categorySlug = "frutas-y-verduras-PC29745";

    // 🔹 Cursor inicial (posición 0,0 para esa categoría)
    let cursorObj = { x: 0, y: 0, z: `FalseSystem.Int32[]${categorySlug}` };
    let cursor = Buffer.from(JSON.stringify(cursorObj)).toString("base64");

    let isLastPage = false;
    let pageCount = 0;

    while (!isLastPage) {
      pageCount++;
      console.log(`📄 Página ${pageCount} | Cursor: ${cursor}`);

      const url = "https://tienda-supermercadomodelo.batitienda.com/Products_Search/List_Scroll";
      const params = {
        Cursor: cursor,
        GetNextPage: true,
        ProductCategoryName: categorySlug
      };

      const { data } = await axios.get(url, {
        params,
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      });

      // Control de última página
      isLastPage = data.isLastPage;

      if (!data.result || !data.rows) {
        console.warn("⚠️ Respuesta vacía o inválida");
        break;
      }

      // 🔹 Parsear el HTML recibido en `rows` para extraer productos
      const products = extractProductsFromHTML(data.rows, seenIds);
      console.log(`📥 Extraídos ${products.length} productos de esta página`);

      allProducts.push(...products);

      // Actualizar cursor
      cursor = data.cursor;

      // Delay para no saturar el servidor
      await delay(800);
    }

    console.log(`✅ modeloStore: ${allProducts.length} productos obtenidos`);
    return allProducts;

  } catch (err) {
    console.error("Error en modeloStore:", err.message);
    return [];
  }
};

// 🔹 Función para parsear el HTML de los productos
function extractProductsFromHTML(html, seenIds) {
  const products = [];
  const regex = /<a href="(\/shop\/product\/[^"]+)".*?data-product="(\d+)".*?<img.*?data-src=(.*?)\s.*?alt="(.*?)".*?class="amount">\s*\$([\d\.,]+)/gs;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [ , productId, img, title, priceStr ] = match;
    const cleanPrice = parseFloat(priceStr.replace(/\./g, "").replace(",", "."));

    if (!seenIds.has(productId)) {
      seenIds.add(productId);
      products.push({
        title: decodeHTMLEntities(title.trim()),
        price: cleanPrice,
        img: img.replace(/^\/\//, "https://"),
        distributor: "modelo",
        product: inferProductType(title, "fruits"),
        url: `https://tienda-supermercadomodelo.batitienda.com${url}`
      });
    }
  }
  return products;
}

// 🔹 Decodificar caracteres HTML (&amp;, &#xE9;, etc.)
function decodeHTMLEntities(text) {
  return text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
             .replace(/&#x([0-9A-Fa-f]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
             .replace(/&amp;/g, "&")
             .replace(/&quot;/g, '"')
             .replace(/&apos;/g, "'")
             .replace(/&lt;/g, "<")
             .replace(/&gt;/g, ">");
}
