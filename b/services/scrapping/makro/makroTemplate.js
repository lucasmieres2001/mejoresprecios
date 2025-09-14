const axios = require("axios");
const { inferProductType } = require("../productType");

exports.makroTemplate = async (categoryCode) => {
  const allProducts = [];
  const seenIds = new Set();
  const pageSize = 100;
  let page = 1;
  let total = Infinity;

  try {
    while ((page - 1) * pageSize < total) {
      console.log(`📄 Página ${page}...`);

      // Armamos el body igual que en el raw
      const body = [
        {
          operationName: "GetProductsByCategory",
          variables: {
            getProductsByCategoryInput: {
              categoryReference: categoryCode,
              categoryId: "null",
              clientId: "MAKRO",
              storeReference: "08ABO",
              currentPage: page,
              pageSize,
              filters: {},
              googleAnalyticsSessionId: ""
            }
          },
          query: `
            query GetProductsByCategory($getProductsByCategoryInput: GetProductsByCategoryInput!) {
              getProductsByCategory(getProductsByCategoryInput: $getProductsByCategoryInput) {
                category {
                  products {
                    sku
                    name
                    slug
                    brand
                    price
                    previousPrice
                    photosUrl
                  }
                }
                pagination {
                  page
                  pages
                  total { value }
                }
              }
            }
          `
        }
      ];

      const { data, status } = await axios.post(
        "https://nextgentheadless.instaleap.io/api/v3",
        body,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          validateStatus: () => true
        }
      );

      if (status !== 200) {
        console.error("❌ Error Makro:", JSON.stringify(data, null, 2));
        break;
      }

      const payload = data?.[0]?.data?.getProductsByCategory;
      if (!payload?.category?.products?.length) {
        console.log("🛑 No hay más productos.");
        break;
      }

      if (total === Infinity) {
        total = payload.pagination?.total?.value || payload.category.products.length;
        console.log(`📊 Total detectado: ${total} productos`);
      }

      for (const product of payload.category.products) {
        if (!product?.sku || seenIds.has(product.sku)) continue;
        seenIds.add(product.sku);

        const title = product.name?.trim();
        const price = product.price;
        const img = product.photosUrl?.[0] || null;
        const link = product.slug
          ? `https://tienda.makro.com.co/p/${product.slug}`
          : null;

        if (!title || !price || !img || !link) continue;

        allProducts.push({
          title,
          price,
          img,
          url: link,
          distributor: "makro",
          product: inferProductType(title, "dairy")
        });
      }

      console.log(`✅ Acumulados: ${allProducts.length}`);
      if (allProducts.length >= total) break;
      page++;
    }

    console.log(`🔍 Total final Makro Dairy: ${allProducts.length}`);
    return allProducts;
  } catch (err) {
    console.error("❌ Error crítico en makroDairy:", err.message);
    return allProducts;
  }
};
