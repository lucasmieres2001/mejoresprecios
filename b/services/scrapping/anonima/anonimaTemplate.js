const axios = require('axios');
const cheerio = require('cheerio');
const { inferProductType } = require('../productType');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.anonimaTemplate = async (slug,codeSlug,category) => {
    const maxPages = 150
    const products = [];
    let page = 1;

    while (page <= maxPages) {
        try {
            const url = page === 1 
                ? `https://supermercado.laanonimaonline.com/${slug}/${codeSlug}/`
                : `https://supermercado.laanonimaonline.com/${slug}/${codeSlug}/pag/${page}/`;

            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml',
                    'Accept-Language': 'es-ES,es;q=0.9',
                }
            });

            const $ = cheerio.load(response.data);
            const productElements = $('.producto.item.text_center.centrar_img.fijar.cuadro.clearfix');
            
            if (productElements.length === 0) {
                console.log(`✅ Scraping de ${slug} completado. Páginas: ${page-1}, Productos: ${products.length}`);
                break;
            }

            console.log(`📄 Página ${page}: ${productElements.length} productos de ${slug}`);

            productElements.each((index, element) => {
                const $el = $(element);
                
                // Extraer datos
                const nameElement = $el.find('a[id^="btn_nombre_imetrics_"]');
                const imgContainer = $el.find('div[id^="btn_img_imetrics_"]');
                const imgElement = imgContainer.find('img');
                const priceElement = $el.find('.precio');
                
                const productId = nameElement.attr('id')?.split('_').pop();
                const name = nameElement.text().trim();
                const productUrl = nameElement.attr('href');
                
                // ESTRATEGIA DE EXTRACCIÓN DE IMAGEN MEJORADA
                let imageUrl = null;
                
                // 1. Primero intentar con data-src (lazy loading)
                imageUrl = imgElement.attr('data-src');
                
                // 2. Si no existe data-src, intentar con src normal
                if (!imageUrl) {
                    imageUrl = imgElement.attr('src');
                }
                
                // 3. Si aún no hay imagen, buscar en otros atributos
                if (!imageUrl) {
                    imageUrl = imgElement.attr('data-original') || 
                              imgElement.attr('data-lazy-src') ||
                              imgElement.attr('data-srcset');
                }
                
                // 4. Limpiar la URL si es necesario (eliminar parámetros de tamaño)
                if (imageUrl) {
                    imageUrl = imageUrl.split('?')[0]; // Remover query parameters
                    imageUrl = imageUrl.replace(/\/\d+x\d+\//, '/'); // Remover dimensiones
                }
                
                const priceText = priceElement.text().trim();
                
                // Limpiar y formatear precio
                const price = parseFloat(
                    priceText.replace('$', '')
                            .replace(/\./g, '')
                            .replace(',', '.')
                ) || 0;

                // Hacer URL absoluta si es relativa
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `https://supermercado.laanonimaonline.com${imageUrl}`;
                }

                // Verificar si la imagen es un GIF de carga y omitirla
                if (imageUrl && imageUrl.includes('loading') || imageUrl.includes('placeholder')) {
                    console.log(`⚠️  Imagen de carga detectada para: ${name}`);
                    imageUrl = null;
                }

                products.push({
                    title: name,
                    price: price,
                    image: imageUrl,
                    url: productUrl ? `https://supermercado.laanonimaonline.com${productUrl}` : null,
                    distributor: "anonima",
                    product: inferProductType(name,category)
                });
            });

            // Pequeña pausa entre requests
            await delay(500);
            page++;

        } catch (error) {
            console.error(`❌ Error de ${slug} en página ${page}:`, error.message);
            break;
        }
    }

    // Filtrar productos sin imagen válida (opcional)
    const validProducts = products.filter(product => 
        product.image && !product.image.includes('loading')
    );
    
    console.log(`✅ Scraping de ${slug} completado. Productos válidos: ${validProducts.length}/${products.length}`);
    
    return validProducts;
};