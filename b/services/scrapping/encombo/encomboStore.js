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

exports.encomboStore = async () => {
    const baseUrl = 'https://encombo.com.ar/almacen.html';
    let page = 1;
    let allProducts = [];
    let emptyPages = 0;
    let productHashes = new Set();
    const MAX_PAGES = 20; // Límite razonable para esta categoría

    while (page <= MAX_PAGES) {
        const url = page === 1 ? baseUrl : `${baseUrl}?p=${page}`;
        console.log(`Scrapeando página ${page}...`);

        await delay(1500 + Math.random() * 1000); // Delay variable

        try {
            const response = await fetchWithRetries(url);
            const $ = cheerio.load(response.data);
            
            // Buscar los productos en la página actual
            const products = $('.product-item').map((i, el) => {
                const product = $(el);
                
                const title = product.find('.product-item-link').text().trim();
                const priceWhole = product.find('.price').text().replace(/\D/g, '');
                const priceDecimal = product.find('.sup').text().trim() || '00';
                const price = parseFloat(`${priceWhole}.${priceDecimal}`);
                const img = product.find('.product-image-photo').attr('src') || '';
                
                return {
                    title,
                    price,
                    img,
                    distributor: "encombo",
                    product: inferProductType(title,'store')
                };
            }).get();

            if (products.length === 0) {
                emptyPages++;
                if (emptyPages >= 2) { // Reducido a 2 páginas vacías para mayor seguridad
                    console.log(`${emptyPages} páginas vacías seguidas. Finalizando.`);
                    break;
                }
                page++;
                continue;
            }

            // Verificar duplicados
            let newProductsCount = 0;
            for (const product of products) {
                const productHash = `${product.title}_${product.price}_${product.img}`;
                if (!productHashes.has(productHash)) {
                    productHashes.add(productHash);
                    allProducts.push(product);
                    newProductsCount++;
                }
            }

            console.log(`Página ${page}: ${newProductsCount} nuevos productos de ${products.length} encontrados`);

            // Condiciones de salida
            if (newProductsCount === 0) {
                emptyPages++;
                if (emptyPages >= 2) {
                    console.log(`${emptyPages} páginas sin nuevos productos. Finalizando.`);
                    break;
                }
            } else {
                emptyPages = 0; // Resetear contador si encontramos productos nuevos
            }

            // Si hay menos de 5 productos nuevos (página final con pocos productos)
            if (newProductsCount > 0 && newProductsCount < 5) {
                console.log(`Página con solo ${newProductsCount} productos nuevos. Posible final del catálogo.`);
                emptyPages++; // Contar como página "casi vacía"
            }

            page++;

        } catch (error) {
            console.error(`Error en la página ${page}:`, error.message);
            break;
        }
    }

    console.log(`Total de productos únicos encontrados: ${allProducts.length}`);
    return allProducts;
};