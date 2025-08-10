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
            await delay(1000);
        }
    }
}

exports.diaFruitsVegetables = async () => {
    const baseUrl = 'https://diaonline.supermercadosdia.com.ar/frescos/frutas-y-verduras';
    let page = 1;
    let allProducts = [];
    let emptyPages = 0;

    while (true) {
        const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
        console.log(`Scrapeando página ${page}...`);

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
                    console.log(`3 páginas vacías seguidas. Finalizando.`);
                    break;
                } else {
                    console.warn(`Página ${page} vacía. Saltando a la siguiente...`);
                    page++;
                    continue;
                }
            }

            emptyPages = 0;

            const products = data.itemListElement.map(item => {
                const producto = item.item;
                return {
                    title: producto.name,
                    price: producto.offers?.lowPrice,
                    img: producto.image,
                    distributor: 'dia',
                    product: inferProductType(producto.name,'fruits')
                };
            });

            allProducts.push(...products);
            page++;

        } catch (error) {
            console.error(`Error en la página ${page}:`, error.message);
            break;
        }
    }

    console.log(`Total de productos encontrados: ${allProducts.length}`);
    return allProducts;
};
