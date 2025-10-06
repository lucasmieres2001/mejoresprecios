const axios = require("axios");
const cheerio = require("cheerio");
const { inferProductType } = require("../productType");

exports.maxiconsumoTemplate = async (slug,type) => {
  const baseUrl = "https://maxiconsumo.com/sucursal_loma_hermosa/"+slug+".html";
  const productos = [];
  const seen = new Set(); // Para evitar duplicados
  let flag = true;
  let page = 1;
  let totalProductos = Infinity; // Inicialmente lo ponemos infinito
  let productosProcesados = 0;

  while (productosProcesados < totalProductos) {
    const url = `${baseUrl}?p=${page}&product_list_limit=96&stock_sucursal=3782`;

    console.log(`📄 Scrapeando página ${page} -> ${url}`);

    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept-Language": "es-AR,es;q=0.9",
        },
      });

      const $ = cheerio.load(data);

      if(flag)
      {
        // 📌 Detectar cuántos productos hay en total (ej: "de 1652")
        const toolbarText = $("#toolbar-amount").text().trim();
        const match = toolbarText.match(/de\s+(\d+)/);
        if (match) {
          totalProductos = parseInt(match[1], 10);
        } else {
          // Busca el último número del string (más seguro)
          const numbers = toolbarText.match(/\d+/g);
          if (numbers && numbers.length > 0) {
            totalProductos = parseInt(numbers[numbers.length - 1], 10);
          }
        }
        flag = false;
      }
      // 📌 Capturar productos
      const items = $("[id^=product-item-info]");
      if (items.length === 0) {
        console.log("⚠️ No se encontraron productos, cortamos el loop.");
        break;
      }

      let nuevos = 0;
      items.each((_, el) => {
        const titleEl = $(el).find("a.product-item-link");
        const title = titleEl.text().trim();
        const link = titleEl.attr("href");
        const priceText = $(el).find("span.price").first().text().trim();
        const price = parseFloat(
          priceText.replace("$", "").replace(/\./g, "").replace(",", ".")
        );
        const img = $(el).find("img.product-image-photo").attr("src");
        
        // VERIFICAR STOCK - clave para filtrar productos con stock
        // Buscar indicadores de falta de stock
        const outOfStockText = $(el).find(".out-of-stock, .stock.unavailable, .actions-primary .out-of-stock").text().toLowerCase();
        const isOutOfStock = outOfStockText.includes('agotado') || 
                            outOfStockText.includes('sin stock') || 
                            outOfStockText.includes('no disponible') ||
                            $(el).find(".out-of-stock").length > 0;
        
        // Si el producto está agotado, saltarlo
        if (isOutOfStock) {
          return; // continue en .each
        }

        const key = `${title}-${price}`;
        if (seen.has(key)) return;
        seen.add(key);

        productos.push({
          title,
          price,
          img,
          url: link,
          distributor: "maxiconsumo",
          product: inferProductType(title, type),
          // stock: true // Opcional: indicar que tiene stock
        });

        productosProcesados++;
        nuevos++;
      });

      // 🚨 Si no se agregó ningún producto nuevo, cortamos el bucle
      if (nuevos === 0) {
        console.log("🔁 Todos los productos de esta página ya fueron vistos. Cortando paginación.");
        break;
      }

      console.log(
        `✅ Página ${page} procesada. Total productos hasta ahora: ${productos.length}/${totalProductos}`
      );

      page++;
    } catch (err) {
      console.error(`❌ Error en página ${page}:`, err.message);
      break;
    }
  }

  console.log(`🔍 Scraping finalizado. Productos con stock: ${productos.length}`);
  return productos;
};