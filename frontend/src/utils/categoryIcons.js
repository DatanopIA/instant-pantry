import { Apple, Leaf, Container, Beef, Fish, Droplet, Wheat, Slice, CupSoda, Package } from 'lucide-react';

export const getCategoryIcon = (category, name) => {
    const text = (`${category || ''} ${name || ''}`).toLowerCase();

    if (text.includes('fruta') || text.includes('manzana') || text.includes('limon') || text.includes('limón') || text.includes('naranja') || text.includes('platano') || text.includes('plátano') || text.includes('fresa') || text.includes('uva') || text.includes('pera') || text.includes('sandía') || text.includes('sandia') || text.includes('melon') || text.includes('melón')) return Apple;
    if (text.includes('verdura') || text.includes('lechuga') || text.includes('tomate') || text.includes('cebolla') || text.includes('vegetal') || text.includes('zanahoria') || text.includes('patata') || text.includes('pimiento') || text.includes('ajo') || text.includes('brócoli') || text.includes('espinaca')) return Leaf;
    if (text.includes('salsa') || text.includes('tomate frito') || text.includes('nata') || text.includes('ketchup') || text.includes('mayonesa') || text.includes('mostaza') || text.includes('soja')) return Container;
    if (text.includes('carne') || text.includes('pollo') || text.includes('cerdo') || text.includes('ternera') || text.includes('filete') || text.includes('pavo') || text.includes('conejo')) return Beef;
    if (text.includes('pescado') || text.includes('marisco') || text.includes('atun') || text.includes('atún') || text.includes('salmon') || text.includes('salmón') || text.includes('gambas') || text.includes('merluza') || text.includes('bacalao') || text.includes('calamar')) return Fish;
    if (text.includes('aceite') || text.includes('especia') || text.includes('sal') || text.includes('pimienta') || text.includes('vinagre') || text.includes('oregano') || text.includes('orégano') || text.includes('pimentón') || text.includes('pimenton')) return Droplet;
    if (text.includes('pan') || text.includes('harina') || text.includes('pan rallado') || text.includes('trigo') || text.includes('cereal') || text.includes('pasta') || text.includes('arroz') || text.includes('macarrones') || text.includes('fideos')) return Wheat;
    if (text.includes('queso') || text.includes('embutido') || text.includes('jamon') || text.includes('jamón') || text.includes('chorizo') || text.includes('salchichón') || text.includes('loncha') || text.includes('pavo') || text.includes('lomo')) return Slice;
    if (text.includes('zumo') || text.includes('leche') || text.includes('agua') || text.includes('bebida') || text.includes('liquido') || text.includes('líquido') || text.includes('refresco') || text.includes('cerveza') || text.includes('vino') || text.includes('caldo')) return CupSoda;

    // Default
    return Package;
};
