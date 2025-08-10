exports.inferProductType = (title, category = "") => {
  const lowerTitle = title.toLowerCase();
  const categoryLowerCase = category.toLowerCase();
    switch (categoryLowerCase) {
        case "cleaning":
            if (lowerTitle.includes('bolsas de consorcio') || lowerTitle.includes('bolsas de residuo') || lowerTitle.includes('bolsas de basura')) return 'bolsa_residuo';
            if (lowerTitle.includes('lavandina')) return 'lavandina';
            if (lowerTitle.includes('detergente')) return 'detergente';
            if (lowerTitle.includes('desinfectante')) return 'desinfectante';
            if (lowerTitle.includes('limpiador') || lowerTitle.includes('limpieza')) return 'limpiador';
            if (lowerTitle.includes('jabón') || lowerTitle.includes('jabón líquido')) return 'jabon';
            if (lowerTitle.includes('esponja')) return 'esponja';
            if (lowerTitle.includes('guante')) return 'guante';
            if (lowerTitle.includes('trapo')) return 'trapo';
            if (lowerTitle.includes('cepillo')) return 'cepillo';
            if (lowerTitle.includes('desodorante de ambiente')) return 'desodorante_ambiente';
            if (lowerTitle.includes('ambientador')) return 'ambientador';
            if (lowerTitle.includes('papel higiénico')) return 'papel_higienico';
            if (lowerTitle.includes('rollo de cocina')) return 'rollo_cocina';
            if (lowerTitle.includes('toalla de papel')) return 'toalla_papel';
            if (lowerTitle.includes('repelente')) return 'repelente';
            if (lowerTitle.includes('insecticida')) return 'insecticida';
            return 'limpieza'
        case "dairy":
            if (lowerTitle.includes('leche')) return 'leche';
            if (lowerTitle.includes('manteca')) return 'manteca';
            if (lowerTitle.includes('yogur')) return 'yogur';
            if (lowerTitle.includes('crema')) return 'crema';
            if (lowerTitle.includes('dulce de leche')) return 'dulce_de_leche';
            if (lowerTitle.includes('margarina')) return 'margarina';
            if (lowerTitle.includes('queso')) return 'queso';
            if (lowerTitle.includes('ricota')) return 'ricota';
            if (lowerTitle.includes('postre')) return 'postre_lácteo';
            if (lowerTitle.includes('flan')) return 'flan';
            if (lowerTitle.includes('saborizado')) return 'leche_saborizada';
            return 'lacteo';
        case "drinks":
            if (lowerTitle.includes('agua')) return 'agua';
            if (lowerTitle.includes('gaseosa')  || 
                lowerTitle.includes('coca')     ||
                lowerTitle.includes('coca-cola')|| 
                lowerTitle.includes('cocacola') || 
                lowerTitle.includes('sprite')   ||
                lowerTitle.includes('pepsi')    ||
                lowerTitle.includes('cola')) return 'gaseosa';
            if (lowerTitle.includes('jugo')) return 'jugo';
            if (lowerTitle.includes('cerveza')) return 'cerveza';
            if (lowerTitle.includes('vino')) return 'vino';
            if (lowerTitle.includes('whisky')) return 'whisky';
            if (lowerTitle.includes('vodka')) return 'vodka';
            if (lowerTitle.includes('energizante')) return 'energizante';
            if (lowerTitle.includes('aperitivo')) return 'aperitivo';
            if (lowerTitle.includes('champagne')) return 'champagne';
            if (lowerTitle.includes('sidra')) return 'sidra';
            if (lowerTitle.includes('licor')) return 'licor';
            if (lowerTitle.includes('fernet')) return 'fernet';
            if (lowerTitle.includes('tequila')) return 'tequila';
            if (lowerTitle.includes('ron')) return 'ron';
            if (lowerTitle.includes('cognac')) return 'cognac';
            if (lowerTitle.includes('agua tónica')) return 'agua_tonica';
            if (lowerTitle.includes('soda')) return 'soda';
            if (lowerTitle.includes('mate')) return 'mate';
            if (lowerTitle.includes('café')) return 'cafe';
            if (lowerTitle.includes('infusión')) return 'infusion';
            return 'bebida';
        case "fruits":
            if (lowerTitle.includes('banana') || lowerTitle.includes('plátano')) return 'fruta';
            if (lowerTitle.includes('pomelo')) return 'pomelo';
            if (lowerTitle.includes('radicheta')) return 'radicheta';
            if (lowerTitle.includes('manzana')) return 'manzana';
            if (lowerTitle.includes('pera')) return 'pera';
            if (lowerTitle.includes('naranja')) return 'naranja';
            if (lowerTitle.includes('mandarina')) return 'mandarina';
            if (lowerTitle.includes('limón')) return 'limon';
            if (lowerTitle.includes('frutilla') || lowerTitle.includes('fresa')) return 'frutilla';
            if (lowerTitle.includes('uva')) return 'uva';
            if (lowerTitle.includes('durazno')) return 'durazno';
            if (lowerTitle.includes('ciruela')) return 'ciruela';
            if (lowerTitle.includes('tomate')) return 'tomate';
            if (lowerTitle.includes('lechuga')) return 'lechuga';
            if (lowerTitle.includes('cebolla')) return 'cebolla';
            if (lowerTitle.includes('papa')) return 'papa';
            if (lowerTitle.includes('batata')) return 'batata';
            if (lowerTitle.includes('zanahoria')) return 'zanahoria';
            if (lowerTitle.includes('calabaza')) return 'calabaza';
            if (lowerTitle.includes('morron') || lowerTitle.includes('pimiento')) return 'morron';
            if (lowerTitle.includes('espinaca')) return 'espinaca';
            if (lowerTitle.includes('acelga')) return 'acelga';
            if (lowerTitle.includes('brocoli')) return 'brocoli';
            if (lowerTitle.includes('coliflor')) return 'coliflor';
            if (lowerTitle.includes('repollo')) return 'repollo';
            if (lowerTitle.includes('ajo')) return 'ajo';
            if (lowerTitle.includes('pepino')) return 'pepino';
            if (lowerTitle.includes('berenjena')) return 'berenjena';
            if (lowerTitle.includes('zapallito')) return 'zapallito';
            if (lowerTitle.includes('rabanito')) return 'rabanito';
            if (lowerTitle.includes('palta') || lowerTitle.includes('aguacate')) return 'palta';
            return 'verdura';
        case "meats":
            if (lowerTitle.includes('falda') || lowerTitle.includes('carne') || lowerTitle.includes('bife') || lowerTitle.includes('asado') || lowerTitle.includes('lomo') || lowerTitle.includes('paleta')) return 'carne_vacuna';
            if (lowerTitle.includes('pollo') || lowerTitle.includes('suprema') || lowerTitle.includes('pata muslo')) return 'pollo';
            if (lowerTitle.includes('carré') || lowerTitle.includes('cerdo') || lowerTitle.includes('bondiola') || lowerTitle.includes('costilla') || lowerTitle.includes('matambre')) return 'cerdo';
            if (lowerTitle.includes('chorizo') || lowerTitle.includes('salchicha parrillera')) return 'chorizo';
            if (lowerTitle.includes('milanesa')) return 'milanesa';
            if (lowerTitle.includes('hamburguesa')) return 'hamburguesa';
            if (lowerTitle.includes('cordero')) return 'cordero';
            if (lowerTitle.includes('pescado') || lowerTitle.includes('merluza') || lowerTitle.includes('atún') || lowerTitle.includes('tilapia')) return 'pescado';
            if (lowerTitle.includes('achura') || lowerTitle.includes('molleja') || lowerTitle.includes('chinchulín') || lowerTitle.includes('riñón') || lowerTitle.includes('tripa') || lowerTitle.includes('parrillada')) return 'achura';
            return 'carne';
        case "pets":
            if (lowerTitle.includes('granulado higiénico') || lowerTitle.includes('arena sanitaria') || lowerTitle.includes('arena para gatos')) return 'granulado_higienico';
            if (lowerTitle.includes('alimento') || lowerTitle.includes('comida para perros') || lowerTitle.includes('comida para gatos') || lowerTitle.includes('balanceado')) return 'alimento';
            if (lowerTitle.includes('snack') || lowerTitle.includes('premio') || lowerTitle.includes('golosina')) return 'snack';
            if (lowerTitle.includes('juguete')) return 'juguete';
            if (lowerTitle.includes('correa') || lowerTitle.includes('collar')) return 'accesorio';
            if (lowerTitle.includes('cama') || lowerTitle.includes('colchoneta')) return 'cama';
            if (lowerTitle.includes('transportadora') || lowerTitle.includes('jaula')) return 'transportadora';
            if (lowerTitle.includes('shampoo') || lowerTitle.includes('acondicionador')) return 'higiene';
            if (lowerTitle.includes('pipeta') || lowerTitle.includes('antipulgas') || lowerTitle.includes('antiparasitario')) return 'antiparasitario';
            if (lowerTitle.includes('comedero') || lowerTitle.includes('bebedero')) return 'comedero_bebedero';
            if (lowerTitle.includes('ropa') || lowerTitle.includes('abrigo')) return 'ropa';
            return 'mascotas';
        case "store":
            if (lowerTitle.includes('budin')) return 'budin';
            if (lowerTitle.includes('alfajor')) return 'alfajor';
            if (lowerTitle.includes('yerba')) return 'yerba';
            if (lowerTitle.includes('oblea')) return 'oblea';
            if (lowerTitle.includes('salsa')) return 'salsa';
            if (lowerTitle.includes('capelettini') || lowerTitle.includes('capelettinis')) return 'capelettini';
            if (lowerTitle.includes('jardinera')) return 'jardinera';
            if (lowerTitle.includes('sandwich') || lowerTitle.includes('sandwiches')) return 'sandwich';
            if (lowerTitle.includes('arveja') || lowerTitle.includes('arvejas')) return 'arveja';
            if (lowerTitle.includes('poroto') || lowerTitle.includes('porotos')) return 'poroto';
            if (lowerTitle.includes('harina')) return 'harina';
            if (lowerTitle.includes('arroz')) return 'arroz';
            if (lowerTitle.includes('fideos') || lowerTitle.includes('pasta')) return 'fideos';
            if (lowerTitle.includes('azúcar') || lowerTitle.includes('azucar')) return 'azucar';
            if (lowerTitle.includes('aceite')) return 'aceite';
            if (lowerTitle.split(/\W+/).includes('sal')) return 'sal';
            if (lowerTitle.includes('galletitas') || lowerTitle.includes('galletas')) return 'galletitas';
            if (lowerTitle.includes('tomate') || lowerTitle.includes('puré de tomate') || lowerTitle.includes('pure de tomate')) return 'pure_de_tomate';
            if (lowerTitle.includes('saborizador') || lowerTitle.includes('caldo') || lowerTitle.includes('sopa')) return 'saborizador';
            if (lowerTitle.includes('aceituna')) return 'aceitunas';
            if (lowerTitle.includes('vinagre')) return 'vinagre';
            if (lowerTitle.includes('mayonesa')) return 'mayonesa';
            if (lowerTitle.includes('mostaza')) return 'mostaza';
            if (lowerTitle.includes('ketchup') || lowerTitle.includes('catsup')) return 'ketchup';
            if (lowerTitle.includes('aderezo')) return 'aderezo';
            if (lowerTitle.includes('conserva') || lowerTitle.includes('enlatado')) return 'conservas';
            if (lowerTitle.includes('miel')) return 'miel';
            if (lowerTitle.includes('mermelada')) return 'mermelada';
            if (lowerTitle.includes('cacao') || lowerTitle.includes('chocolate')) return 'cacao';
            if (lowerTitle.includes('té ') || lowerTitle.startsWith('te ')) return 'te';
            if (lowerTitle.includes('café') || lowerTitle.includes('cafe')) return 'cafe';
            if (lowerTitle.includes('azafrán') || lowerTitle.includes('azafran')) return 'azafran';
            if (lowerTitle.includes('levadura')) return 'levadura';
            if (lowerTitle.includes('polenta')) return 'polenta';
            if (lowerTitle.includes('pan rallado')) return 'pan_rallado';
            if (lowerTitle.includes('pan')) return 'pan';
            if (lowerTitle.includes('almendra')) return 'almendras';
            if (lowerTitle.includes('nuez')) return 'nuez';
            if (lowerTitle.includes('pasas')) return 'pasas';
            if (lowerTitle.includes('semilla')) return 'semillas';
            if (lowerTitle.includes('cereal')) return 'cereal';
            if (lowerTitle.includes('granola')) return 'granola';
            if (lowerTitle.includes('azucar impalpable')) return 'azucar_impalpable';
            if (lowerTitle.includes('premezcla')) return 'premezcla';
            return 'almacen';
        default:
            return 'Sin especificar';
    }
}