const axios = require('axios');
const cheerio = require('cheerio');
const { inferProductType } = require('../productType');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchWithRetries(url, maxRetries = 3) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            return await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
        } catch (err) {
            console.warn(`Error ${i}/${maxRetries} para ${url}`);
            if (i === maxRetries) throw err;
            await delay(1000); // esperar 1 segundo antes de reintentar
        }
    }
}

exports.diaDairy = async () => {
    const baseUrls = [
        'https://diaonline.supermercadosdia.com.ar/frescos/lacteos',
        'https://diaonline.supermercadosdia.com.ar/frescos/leches'
    ];

    let allProducts = [];

    for (const baseUrl of baseUrls) {
        let page = 1;
        let emptyPages = 0;

        console.log(`🟡 Iniciando scraping de: ${baseUrl}`);

        while (true) {
            const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
            console.log(`Scrapeando página ${page} de ${baseUrl}...`);

            await delay(1000); // evitar bloqueo por scraping

            try {
                const response = await fetchWithRetries(url);
                const $ = cheerio.load(response.data);
                const ldJsonScripts = $('script[type="application/ld+json"]');

                let data = null;

                ldJsonScripts.each((i, el) => {
                    try {
                        const parsed = JSON.parse($(el).html());
                        if (parsed['@type'] === 'ItemList') {
                            data = parsed;
                            return false;
                        }
                    } catch (_) {}
                });

                if (!data || !data.itemListElement || data.itemListElement.length === 0) {
                    emptyPages++;
                    if (emptyPages >= 3) {
                        console.log(`🔴 3 páginas vacías seguidas. Finalizando sección de ${baseUrl}.`);
                        break;
                    } else {
                        console.warn(`⚠️ Página ${page} vacía. Continuando...`);
                        page++;
                        continue;
                    }
                }

                emptyPages = 0; // resetear si hubo productos

                const products = data.itemListElement.map(item => {
                    const producto = item.item;
                    return {
                        title: producto.name,
                        price: producto.offers?.lowPrice,
                        img: producto.image,
                        distributor: 'dia',
                        product: inferProductType(producto.name,'dairy')
                    };
                });

                allProducts.push(...products);
                page++;

            } catch (error) {
                console.error(`❌ Error en la página ${page} de ${baseUrl}:`, error.message);
                break;
            }
        }

        console.log(`✅ Finalizado scraping de ${baseUrl}`);
    }

    console.log(`🟢 Total de productos encontrados: ${allProducts.length}`);
    return allProducts;
};
