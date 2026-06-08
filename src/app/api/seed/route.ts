import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const QUARTIERS = [
  'Yoff', 'Castor', 'Médina', 'Plateau', 'Ouakam', 'Mermoz',
  'Point E', 'Fann', 'Almadies', 'Sacré-Cœur', 'Ngor',
  'Dieuppeul', 'Grand Dakar', 'HLM', 'Biscuiterie', 'Liberté'
]

const CATEGORIES = [
  // Fruits & Légumes
  { name: 'Fruits', slug: 'fruits', icon: '🍎', color: '#F97316' },
  { name: 'Légumes', slug: 'legumes', icon: '🥬', color: '#22C55E' },
  { name: 'Tubercules', slug: 'tubercules', icon: '🥔', color: '#A16207' },
  { name: 'Herbes & Aromates', slug: 'aromates', icon: '🌿', color: '#16A34A' },

  // Viandes & Volailles
  { name: 'Viande de bœuf', slug: 'boeuf', icon: '🥩', color: '#DC2626' },
  { name: 'Viande de mouton', slug: 'mouton', icon: '🐑', color: '#B91C1C' },
  { name: 'Volailles & Poulets', slug: 'volailles', icon: '🍗', color: '#F59E0B' },
  { name: 'Abats & Tripes', slug: 'abats', icon: '🫀', color: '#9F1239' },

  // Poissons & Fruits de mer
  { name: 'Poissons frais', slug: 'poissons', icon: '🐟', color: '#0891B2' },
  { name: 'Poissons fumés/séchés', slug: 'poissons-seches', icon: '🐟', color: '#7C3AED' },
  { name: 'Crevettes & Fruits de mer', slug: 'fruits-de-mer', icon: '🦐', color: '#E11D48' },

  // Produits laitiers
  { name: 'Lait', slug: 'lait', icon: '🥛', color: '#3B82F6' },
  { name: 'Yaourts & Fromages', slug: 'yaourts-fromages', icon: '🧀', color: '#FBBF24' },

  // Boissons
  { name: 'Jus naturels', slug: 'jus-naturels', icon: '🧃', color: '#F97316' },
  { name: 'Boissons gazeuses', slug: 'gazeuses', icon: '🥤', color: '#8B5CF6' },
  { name: 'Eau & Hydratation', slug: 'eau', icon: '💧', color: '#0EA5E9' },
  { name: 'Café & Thé', slug: 'cafe-the', icon: '☕', color: '#78350F' },

  // Céréales & Féculents
  { name: 'Riz', slug: 'riz', icon: '🍚', color: '#F5F5F4' },
  { name: 'Mil & Sorgho', slug: 'mil-sorgho', icon: '🌾', color: '#EAB308' },
  { name: 'Maïs & Fonio', slug: 'mais-fonio', icon: '🌽', color: '#FB923C' },
  { name: 'Pain & Boulangerie', slug: 'boulangerie', icon: '🍞', color: '#D97706' },
  { name: 'Pâtes & Couscous', slug: 'pates-couscous', icon: '🍝', color: '#E5E7EB' },

  // Huiles & Corps gras
  { name: 'Huiles', slug: 'huiles', icon: '🫒', color: '#84CC16' },
  { name: 'Beurre & Margarine', slug: 'beurre-margarine', icon: '🧈', color: '#FDE047' },

  // Condiments & Sauces
  { name: 'Épices & Piments', slug: 'epices', icon: '🌶️', color: '#DC2626' },
  { name: 'Sauces & Coulis', slug: 'sauces', icon: '🫙', color: '#EF4444' },
  { name: 'Bouillons & Assaisonnements', slug: 'bouillons', icon: '🧂', color: '#F59E0B' },
  { name: 'Sel & Sucre', slug: 'sel-sucre', icon: '🧂', color: '#E5E7EB' },

  // Conserves & Transforms
  { name: 'Conserves', slug: 'conserves', icon: '🥫', color: '#EF4444' },
  { name: 'Confitures & Miels', slug: 'confitures-miels', icon: '🍯', color: '#D97706' },

  // Produits locaux
  { name: 'Produits locaux', slug: 'locaux', icon: '🇸🇳', color: '#16A34A' },
  { name: 'Snacks & Biscuits', slug: 'snacks', icon: '🍪', color: '#A16207' },
  { name: 'Produits bébé', slug: 'bebe', icon: '🍼', color: '#F472B6' },
  { name: 'Hygiène & Entretien', slug: 'hygiene', icon: '🧴', color: '#6366F1' },
  { name: 'Surgelés', slug: 'surgelés', icon: '❄️', color: '#38BDF8' },

  // Plats préparés & Traiteur
  { name: 'Plats cuisinés', slug: 'plats-cuisines', icon: '🍲', color: '#D97706' },
  { name: 'Sandwichs & Burgers', slug: 'sandwichs', icon: '🥪', color: '#F59E0B' },
  { name: 'Grillades & Dibi', slug: 'grillades', icon: '🔥', color: '#DC2626' },
  { name: 'Glaces & Desserts', slug: 'glaces-desserts', icon: '🍦', color: '#F472B6' },
]

const SELLERS = [
  { name: 'Mamadou Diop', phone: '771234567', password: 'pass123', quartier: 'Yoff', rating: 4.5, sales: 320, premium: 'pro' },
  { name: 'Fatou Sow', phone: '772345678', password: 'pass123', quartier: 'Castor', rating: 4.8, sales: 540, premium: 'pro' },
  { name: 'Ibrahima Ndiaye', phone: '773456789', password: 'pass123', quartier: 'Médina', rating: 4.2, sales: 180, premium: 'basic' },
  { name: 'Aissatou Ba', phone: '774567890', password: 'pass123', quartier: 'Plateau', rating: 4.7, sales: 410, premium: 'pro' },
  { name: 'Ousmane Fall', phone: '775678901', password: 'pass123', quartier: 'Ouakam', rating: 4.0, sales: 90, premium: 'none' },
  { name: 'Mariama Diallo', phone: '776789012', password: 'pass123', quartier: 'Mermoz', rating: 4.6, sales: 350, premium: 'basic' },
  { name: 'Moussa Sy', phone: '777890123', password: 'pass123', quartier: 'Point E', rating: 4.3, sales: 200, premium: 'none' },
  { name: 'Khady Wade', phone: '778901234', password: 'pass123', quartier: 'Fann', rating: 4.9, sales: 620, premium: 'vip' },
  { name: 'Amadou Mbaye', phone: '779012345', password: 'pass123', quartier: 'Almadies', rating: 4.1, sales: 110, premium: 'none' },
  { name: 'Aminata Gueye', phone: '770123456', password: 'pass123', quartier: 'Sacré-Cœur', rating: 4.4, sales: 260, premium: 'basic' },
  { name: 'Cheikh Seck', phone: '781234567', password: 'pass123', quartier: 'Ngor', rating: 4.6, sales: 290, premium: 'pro' },
  { name: 'Diodio Sarr', phone: '782345678', password: 'pass123', quartier: 'Dieuppeul', rating: 4.3, sales: 170, premium: 'none' },
  { name: 'Pape Thiam', phone: '783456789', password: 'pass123', quartier: 'Grand Dakar', rating: 4.5, sales: 310, premium: 'basic' },
  { name: 'Ndeye Mbaye', phone: '784567890', password: 'pass123', quartier: 'HLM', rating: 4.7, sales: 450, premium: 'vip' },
  { name: 'Saliou Camara', phone: '785678901', password: 'pass123', quartier: 'Biscuiterie', rating: 4.2, sales: 130, premium: 'none' },
  { name: 'Awa Niang', phone: '786789012', password: 'pass123', quartier: 'Liberté', rating: 4.5, sales: 270, premium: 'basic' },
  { name: 'Boubacar Diouf', phone: '787890123', password: 'pass123', quartier: 'Yoff', rating: 3.9, sales: 60, premium: 'none' },
  { name: 'Coumba Faye', phone: '788901234', password: 'pass123', quartier: 'Médina', rating: 4.8, sales: 480, premium: 'pro' },
  { name: 'Lamine Traoré', phone: '789012345', password: 'pass123', quartier: 'Plateau', rating: 4.4, sales: 230, premium: 'basic' },
  { name: 'Rokhaya Samb', phone: '780123456', password: 'pass123', quartier: 'Castor', rating: 4.6, sales: 340, premium: 'pro' },
  { name: 'Souleymane Dia', phone: '761234567', password: 'pass123', quartier: 'Ouakam', rating: 4.1, sales: 100, premium: 'none' },
  { name: 'Ouly Diallo', phone: '762345678', password: 'pass123', quartier: 'Mermoz', rating: 4.7, sales: 390, premium: 'basic' },
  { name: 'Abdou Karim', phone: '763456789', password: 'pass123', quartier: 'Fann', rating: 4.3, sales: 190, premium: 'none' },
  { name: 'Marème Lo', phone: '764567890', password: 'pass123', quartier: 'Almadies', rating: 4.8, sales: 510, premium: 'pro' },
  { name: 'Ismaila Cissé', phone: '765678901', password: 'pass123', quartier: 'Point E', rating: 4.0, sales: 80, premium: 'none' },
]

const LISTINGS_DATA: { title: string; price: number; unit: string; categorySlug: string }[] = [
  // ====== FRUITS ======
  { title: 'Mangues Kent', price: 500, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Mangues Palmer', price: 600, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Bananes', price: 400, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Bananes plantain', price: 450, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Oranges', price: 350, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Mandarines', price: 500, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Pamplemousse', price: 400, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Citrons verts', price: 300, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Citrons jaunes', price: 350, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Papayes', price: 600, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Ananas', price: 500, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Pastèque', price: 800, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Melon', price: 700, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Avocats', price: 800, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Goyaves', price: 500, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Dattes', price: 2000, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Raisins', price: 2500, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Pommes', price: 2000, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Poires', price: 2200, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Fraises', price: 3000, unit: 'barquette', categorySlug: 'fruits' },

  // ====== LÉGUMES ======
  { title: 'Tomates', price: 500, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Tomates cerises', price: 800, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Oignons', price: 400, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Oignons violets', price: 500, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Aubergines', price: 600, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Aubergines amères', price: 700, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Gombo', price: 700, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Choux', price: 500, unit: 'pièce', categorySlug: 'legumes' },
  { title: 'Choux fleurs', price: 600, unit: 'pièce', categorySlug: 'legumes' },
  { title: 'Poivrons verts', price: 800, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Poivrons rouges', price: 900, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Piments frais', price: 600, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Concombres', price: 400, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Courgettes', price: 600, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Carottes', price: 500, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Haricots verts', price: 700, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Laitue', price: 300, unit: 'pièce', categorySlug: 'legumes' },
  { title: 'Salade', price: 250, unit: 'pièce', categorySlug: 'legumes' },
  { title: 'Céleri', price: 500, unit: 'botte', categorySlug: 'legumes' },
  { title: 'Persil', price: 200, unit: 'botte', categorySlug: 'legumes' },

  // ====== TUBERCULES ======
  { title: 'Manioc', price: 350, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Manioc frais', price: 300, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Pommes de terre', price: 450, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Patate douce', price: 400, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Patate douce blanche', price: 350, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Ignames', price: 500, unit: 'kg', categorySlug: 'tubercules' },
  { title: 'Taro', price: 450, unit: 'kg', categorySlug: 'tubercules' },

  // ====== AROMATES ======
  { title: 'Menthe fraîche', price: 200, unit: 'botte', categorySlug: 'aromates' },
  { title: 'Coriandre', price: 200, unit: 'botte', categorySlug: 'aromates' },
  { title: 'Basilic', price: 250, unit: 'botte', categorySlug: 'aromates' },
  { title: 'Thym', price: 200, unit: 'botte', categorySlug: 'aromates' },
  { title: 'Laurier', price: 150, unit: 'botte', categorySlug: 'aromates' },
  { title: 'Ciboulette', price: 200, unit: 'botte', categorySlug: 'aromates' },

  // ====== VIANDE DE BŒUF ======
  { title: 'Viande de bœuf', price: 4500, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Bœuf haché', price: 4000, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Entrecôte', price: 6000, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Filet de bœuf', price: 7000, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Côte de bœuf', price: 5500, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Foie de bœuf', price: 3000, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Langue de bœuf', price: 3500, unit: 'kg', categorySlug: 'boeuf' },
  { title: 'Queue de bœuf', price: 2500, unit: 'kg', categorySlug: 'boeuf' },

  // ====== MOUTON ======
  { title: 'Viande de mouton', price: 5500, unit: 'kg', categorySlug: 'mouton' },
  { title: 'Dibi mouton', price: 6000, unit: 'kg', categorySlug: 'mouton' },
  { title: 'Côtelettes de mouton', price: 6500, unit: 'kg', categorySlug: 'mouton' },
  { title: 'Épaule de mouton', price: 5000, unit: 'kg', categorySlug: 'mouton' },
  { title: 'Viande de chèvre', price: 5000, unit: 'kg', categorySlug: 'mouton' },
  { title: 'Merguez', price: 2500, unit: 'kg', categorySlug: 'mouton' },

  // ====== VOLAILLES ======
  { title: 'Poulet fermier', price: 3500, unit: 'pièce', categorySlug: 'volailles' },
  { title: 'Poulet congelé', price: 2200, unit: 'pièce', categorySlug: 'volailles' },
  { title: 'Poulet entier', price: 2800, unit: 'pièce', categorySlug: 'volailles' },
  { title: 'Cuisses de poulet', price: 2500, unit: 'kg', categorySlug: 'volailles' },
  { title: 'Ailes de poulet', price: 2000, unit: 'kg', categorySlug: 'volailles' },
  { title: 'Dinde', price: 4000, unit: 'kg', categorySlug: 'volailles' },
  { title: 'Œufs (plateau 30)', price: 3000, unit: 'plateau', categorySlug: 'volailles' },
  { title: 'Œufs (demi-douzaine)', price: 600, unit: '6 pièces', categorySlug: 'volailles' },
  { title: 'Canard', price: 5000, unit: 'pièce', categorySlug: 'volailles' },

  // ====== ABATS ======
  { title: 'Foie de volaille', price: 2500, unit: 'kg', categorySlug: 'abats' },
  { title: 'Cœur de bœuf', price: 3000, unit: 'kg', categorySlug: 'abats' },
  { title: 'Tripes', price: 2000, unit: 'kg', categorySlug: 'abats' },
  { title: 'Rognons', price: 2500, unit: 'kg', categorySlug: 'abats' },
  { title: 'Pieds de mouton', price: 1500, unit: 'kg', categorySlug: 'abats' },

  // ====== POISSONS FRAIS ======
  { title: 'Thiass (carpe)', price: 2000, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Mérou', price: 5000, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Dorade', price: 3500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Sardine fraîche', price: 1500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Maquereau', price: 2500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Thon frais', price: 4500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Bar', price: 5500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Pageot', price: 3000, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Brochet', price: 3500, unit: 'kg', categorySlug: 'poissons' },
  { title: 'Mulet', price: 2000, unit: 'kg', categorySlug: 'poissons' },

  // ====== POISSONS SÉCHÉS ======
  { title: 'Thiass séché', price: 3000, unit: 'kg', categorySlug: 'poissons-seches' },
  { title: 'Sardine séchée (yet)', price: 2500, unit: 'kg', categorySlug: 'poissons-seches' },
  { title: 'Mulet fumé', price: 3500, unit: 'kg', categorySlug: 'poissons-seches' },
  { title: 'Poisson fumé (tambadiang)', price: 4000, unit: 'kg', categorySlug: 'poissons-seches' },
  { title: 'Morue séchée (kong)', price: 3000, unit: 'kg', categorySlug: 'poissons-seches' },
  { title: 'Yet (coquillage séché)', price: 2000, unit: 'kg', categorySlug: 'poissons-seches' },

  // ====== FRUITS DE MER ======
  { title: 'Crevettes fraîches', price: 8000, unit: 'kg', categorySlug: 'fruits-de-mer' },
  { title: 'Crevettes congelées', price: 5500, unit: 'kg', categorySlug: 'fruits-de-mer' },
  { title: 'Poulpe', price: 4000, unit: 'kg', categorySlug: 'fruits-de-mer' },
  { title: 'Calamar', price: 4500, unit: 'kg', categorySlug: 'fruits-de-mer' },
  { title: 'Huîtres', price: 3000, unit: 'douzaine', categorySlug: 'fruits-de-mer' },
  { title: 'Crabe', price: 3500, unit: 'kg', categorySlug: 'fruits-de-mer' },
  { title: 'Langouste', price: 12000, unit: 'kg', categorySlug: 'fruits-de-mer' },

  // ====== LAIT ======
  { title: 'Lait frais pasteurisé', price: 500, unit: 'litre', categorySlug: 'lait' },
  { title: 'Lait caillé (Sow)', price: 400, unit: 'litre', categorySlug: 'lait' },
  { title: 'Lait concentré sucré', price: 800, unit: 'boîte', categorySlug: 'lait' },
  { title: 'Lait en poudre', price: 3500, unit: 'sachet 400g', categorySlug: 'lait' },
  { title: 'Lait UHT demi-écrémé', price: 600, unit: 'litre', categorySlug: 'lait' },
  { title: 'Lait UHT entier', price: 650, unit: 'litre', categorySlug: 'lait' },

  // ====== YAOURTS & FROMAGES ======
  { title: 'Yaourt nature', price: 300, unit: 'pot 250ml', categorySlug: 'yaourts-fromages' },
  { title: 'Yaourt aux fruits', price: 350, unit: 'pot 250ml', categorySlug: 'yaourts-fromages' },
  { title: 'Yaourt brassé', price: 400, unit: 'pot 200ml', categorySlug: 'yaourts-fromages' },
  { title: 'Fromage cottage', price: 1500, unit: 'kg', categorySlug: 'yaourts-fromages' },
  { title: 'Fromage fondu', price: 800, unit: 'portion', categorySlug: 'yaourts-fromages' },
  { title: 'Beurre frais', price: 2000, unit: 'kg', categorySlug: 'yaourts-fromages' },
  { title: 'Crème fraîche', price: 1200, unit: 'pot 200ml', categorySlug: 'yaourts-fromages' },

  // ====== JUS NATURELS ======
  { title: 'Bissap', price: 200, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Bouyi (jus de baobab)', price: 250, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus de gingembre', price: 300, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus de mangue frais', price: 350, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus de dakhar (tamarin)', price: 250, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus d\'orange frais', price: 300, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus de goyave', price: 350, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Wonjo (jus d\'hibiscus)', price: 200, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },
  { title: 'Jus d\'ananas', price: 300, unit: 'bouteille 1L', categorySlug: 'jus-naturels' },

  // ====== GAZEUSES ======
  { title: 'Coca-Cola 1.5L', price: 500, unit: 'bouteille', categorySlug: 'gazeuses' },
  { title: 'Fanta 1.5L', price: 500, unit: 'bouteille', categorySlug: 'gazeuses' },
  { title: 'Sprite 1.5L', price: 500, unit: 'bouteille', categorySlug: 'gazeuses' },
  { title: 'Soda locale 1L', price: 300, unit: 'bouteille', categorySlug: 'gazeuses' },

  // ====== EAU ======
  { title: 'Eau minérale 1.5L', price: 250, unit: 'bouteille', categorySlug: 'eau' },
  { title: 'Eau minérale 5L', price: 600, unit: 'bonbonne', categorySlug: 'eau' },
  { title: 'Eau de source', price: 200, unit: 'bouteille 1L', categorySlug: 'eau' },
  { title: 'Sachet d\'eau', price: 50, unit: 'sachet', categorySlug: 'eau' },

  // ====== CAFÉ & THÉ ======
  { title: 'Café Touba', price: 150, unit: 'tasse', categorySlug: 'cafe-the' },
  { title: 'Café en poudre', price: 1200, unit: 'sachet 250g', categorySlug: 'cafe-the' },
  { title: 'Café moulu', price: 1500, unit: 'sachet 500g', categorySlug: 'cafe-the' },
  { title: 'Café instantané', price: 2000, unit: 'pot 200g', categorySlug: 'cafe-the' },
  { title: 'Ataya (thé vert)', price: 100, unit: 'verre', categorySlug: 'cafe-the' },
  { title: 'Thé à la menthe', price: 100, unit: 'verre', categorySlug: 'cafe-the' },
  { title: 'Thé en sachet', price: 800, unit: 'boîte 25 sachets', categorySlug: 'cafe-the' },

  // ====== RIZ ======
  { title: 'Riz brisé 10kg', price: 6500, unit: 'sac 10kg', categorySlug: 'riz' },
  { title: 'Riz brisé 25kg', price: 15000, unit: 'sac 25kg', categorySlug: 'riz' },
  { title: 'Riz brisé 50kg', price: 28000, unit: 'sac 50kg', categorySlug: 'riz' },
  { title: 'Riz long grain', price: 9000, unit: 'sac 10kg', categorySlug: 'riz' },
  { title: 'Riz parfumé', price: 8000, unit: 'sac 10kg', categorySlug: 'riz' },
  { title: 'Riz basmati', price: 10000, unit: 'sac 10kg', categorySlug: 'riz' },

  // ====== MIL & SORGHO ======
  { title: 'Mil', price: 500, unit: 'kg', categorySlug: 'mil-sorgho' },
  { title: 'Mil en grains', price: 450, unit: 'kg', categorySlug: 'mil-sorgho' },
  { title: 'Sorgho', price: 350, unit: 'kg', categorySlug: 'mil-sorgho' },
  { title: 'Couscous de mil', price: 600, unit: 'kg', categorySlug: 'mil-sorgho' },
  { title: 'Thiakry', price: 500, unit: 'kg', categorySlug: 'mil-sorgho' },

  // ====== MAÏS & FONIO ======
  { title: 'Maïs en grains', price: 400, unit: 'kg', categorySlug: 'mais-fonio' },
  { title: 'Maïs frais', price: 300, unit: 'pièce', categorySlug: 'mais-fonio' },
  { title: 'Fonio', price: 1200, unit: 'kg', categorySlug: 'mais-fonio' },
  { title: 'Farine de maïs', price: 500, unit: 'kg', categorySlug: 'mais-fonio' },

  // ====== BOULANGERIE ======
  { title: 'Pain complet', price: 150, unit: 'pièce', categorySlug: 'boulangerie' },
  { title: 'Baguette', price: 150, unit: 'pièce', categorySlug: 'boulangerie' },
  { title: 'Pain de mie', price: 500, unit: 'paquet', categorySlug: 'boulangerie' },
  { title: 'Croissants', price: 250, unit: 'pièce', categorySlug: 'boulangerie' },
  { title: 'Pâtisseries diverses', price: 300, unit: 'pièce', categorySlug: 'boulangerie' },
  { title: 'Gâteaux sénégalais', price: 2000, unit: 'plateau', categorySlug: 'boulangerie' },
  { title: 'Ngalakh', price: 1500, unit: 'bol', categorySlug: 'boulangerie' },

  // ====== PÂTES & COUSCOUS ======
  { title: 'Spaghetti', price: 500, unit: 'paquet 500g', categorySlug: 'pates-couscous' },
  { title: 'Macaronis', price: 500, unit: 'paquet 500g', categorySlug: 'pates-couscous' },
  { title: 'Couscous de blé', price: 600, unit: 'kg', categorySlug: 'pates-couscous' },
  { title: 'Vermicelles', price: 400, unit: 'paquet', categorySlug: 'pates-couscous' },
  { title: 'Linguine', price: 600, unit: 'paquet 500g', categorySlug: 'pates-couscous' },

  // ====== HUILES ======
  { title: 'Huile d\'arachide', price: 1500, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile de palme', price: 1200, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile végétale', price: 1000, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile d\'olive', price: 3500, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile de tournesol', price: 1300, unit: 'litre', categorySlug: 'huiles' },

  // ====== BEURRE & MARGARINE ======
  { title: 'Beurre doux', price: 2000, unit: 'pot 250g', categorySlug: 'beurre-margarine' },
  { title: 'Beurre salé', price: 2000, unit: 'pot 250g', categorySlug: 'beurre-margarine' },
  { title: 'Margarine', price: 800, unit: 'pot 500g', categorySlug: 'beurre-margarine' },
  { title: 'Ghee (beurre clarifié)', price: 3000, unit: 'pot', categorySlug: 'beurre-margarine' },

  // ====== ÉPICES ======
  { title: 'Piment en poudre', price: 500, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Poivre noir', price: 800, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Gingembre en poudre', price: 600, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Curcuma', price: 500, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Cumin', price: 700, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Moutarde locale', price: 400, unit: 'pot', categorySlug: 'epices' },
  { title: 'Cannelle', price: 600, unit: 'sachet', categorySlug: 'epices' },
  { title: 'Clou de girofle', price: 800, unit: 'sachet', categorySlug: 'epices' },
  { title: 'Nététou (soumbala)', price: 500, unit: 'boule', categorySlug: 'epices' },
  { title: 'Safou (poivre local)', price: 300, unit: 'sachet', categorySlug: 'epices' },

  // ====== SAUCES ======
  { title: 'Sauce tomate', price: 400, unit: 'bouteille', categorySlug: 'sauces' },
  { title: 'Coulis de tomate', price: 350, unit: 'boîte', categorySlug: 'sauces' },
  { title: 'Ketchup', price: 500, unit: 'bouteille', categorySlug: 'sauces' },
  { title: 'Mayonnaise', price: 600, unit: 'pot', categorySlug: 'sauces' },
  { title: 'Vinaigre', price: 300, unit: 'bouteille', categorySlug: 'sauces' },
  { title: 'Sauce soja', price: 500, unit: 'bouteille', categorySlug: 'sauces' },
  { title: 'Sauce piquante', price: 400, unit: 'bouteille', categorySlug: 'sauces' },

  // ====== BOUILLONS ======
  { title: 'Maggi cubes', price: 100, unit: 'sachet 10 cubes', categorySlug: 'bouillons' },
  { title: 'Jumbo cubes', price: 100, unit: 'sachet 10 cubes', categorySlug: 'bouillons' },
  { title: 'Kub Or', price: 120, unit: 'sachet 10 cubes', categorySlug: 'bouillons' },
  { title: 'Adja cubes', price: 80, unit: 'sachet 10 cubes', categorySlug: 'bouillons' },

  // ====== SEL & SUCRE ======
  { title: 'Sel iodé', price: 150, unit: 'sachet 500g', categorySlug: 'sel-sucre' },
  { title: 'Sucre en poudre', price: 700, unit: 'kg', categorySlug: 'sel-sucre' },
  { title: 'Sucre en morceaux', price: 800, unit: 'kg', categorySlug: 'sel-sucre' },
  { title: 'Sel de Guérande', price: 1000, unit: 'sachet', categorySlug: 'sel-sucre' },

  // ====== CONSERVES ======
  { title: 'Conserve de tomate', price: 350, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Sardine en boîte', price: 400, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Thon en boîte', price: 600, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Corned beef', price: 1500, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Haricots blancs en boîte', price: 500, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Pois chiche en boîte', price: 500, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Maïs en boîte', price: 400, unit: 'boîte', categorySlug: 'conserves' },
  { title: 'Légumes en conserve', price: 450, unit: 'boîte', categorySlug: 'conserves' },

  // ====== CONFITURES & MIELS ======
  { title: 'Miel naturel', price: 3000, unit: 'pot 500g', categorySlug: 'confitures-miels' },
  { title: 'Miel de savane', price: 3500, unit: 'pot 500g', categorySlug: 'confitures-miels' },
  { title: 'Confiture de mangue', price: 1500, unit: 'pot', categorySlug: 'confitures-miels' },
  { title: 'Confiture d\'orange', price: 1500, unit: 'pot', categorySlug: 'confitures-miels' },

  // ====== PRODUITS LOCAUX ======
  { title: 'Mballax (pâte d\'arachide)', price: 500, unit: 'pot', categorySlug: 'locaux' },
  { title: 'Arachides fraîches', price: 400, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Arachides grillées', price: 500, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Tigre de terre (noix de cajou)', price: 3000, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Noix de colas', price: 1000, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Berouf (graine de néré)', price: 600, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Ditakh', price: 500, unit: 'kg', categorySlug: 'locaux' },
  { title: 'Pain de singe', price: 300, unit: 'kg', categorySlug: 'locaux' },

  // ====== SNACKS ======
  { title: 'Biscuits salés', price: 300, unit: 'paquet', categorySlug: 'snacks' },
  { title: 'Biscuits sucrés', price: 300, unit: 'paquet', categorySlug: 'snacks' },
  { title: 'Chips', price: 400, unit: 'paquet', categorySlug: 'snacks' },
  { title: 'Bonbons', price: 100, unit: 'sachet', categorySlug: 'snacks' },
  { title: 'Chocolat', price: 500, unit: 'tablette', categorySlug: 'snacks' },
  { title: 'Cacahuètes', price: 200, unit: 'sachet', categorySlug: 'snacks' },

  // ====== BÉBÉ ======
  { title: 'Lait infantile 1er âge', price: 5000, unit: 'boîte 400g', categorySlug: 'bebe' },
  { title: 'Lait infantile 2e âge', price: 4500, unit: 'boîte 400g', categorySlug: 'bebe' },
  { title: 'Bouillie pour bébé', price: 1500, unit: 'sachet', categorySlug: 'bebe' },
  { title: 'Petit pot bébé', price: 400, unit: 'pot', categorySlug: 'bebe' },
  { title: 'Céréales infantiles', price: 2000, unit: 'boîte', categorySlug: 'bebe' },

  // ====== HYGIÈNE ======
  { title: 'Savon de Marseille', price: 300, unit: 'pièce', categorySlug: 'hygiene' },
  { title: 'Savon liquide', price: 500, unit: 'bouteille', categorySlug: 'hygiene' },
  { title: 'Détergent', price: 600, unit: 'sachet 1kg', categorySlug: 'hygiene' },
  { title: 'Javel', price: 300, unit: 'bouteille', categorySlug: 'hygiene' },
  { title: 'Dentifrice', price: 400, unit: 'tube', categorySlug: 'hygiene' },
  { title: 'Shampoing', price: 600, unit: 'flacon', categorySlug: 'hygiene' },
  { title: 'Eau de Javel', price: 250, unit: 'litre', categorySlug: 'hygiene' },

  // ====== SURGELÉS ======
  { title: 'Poulet congelé entier', price: 2200, unit: 'pièce', categorySlug: 'surgelés' },
  { title: 'Crevettes congelées', price: 5500, unit: 'kg', categorySlug: 'surgelés' },
  { title: 'Poisson congelé', price: 2000, unit: 'kg', categorySlug: 'surgelés' },
  { title: 'Légumes surgelés', price: 1500, unit: 'sachet', categorySlug: 'surgelés' },
  { title: 'Frites surgelées', price: 2000, unit: 'sachet 1kg', categorySlug: 'surgelés' },

  // ====== PLATS CUISINÉS ======
  { title: 'Thieboudienne (poisson)', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Thieboudienne (viande)', price: 2500, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Yassa poulet', price: 2500, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Yassa poisson', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Maafe (sauce arachide)', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Soupou kandia', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Ceebu jën (thieb poisson)', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Thiou au poisson', price: 1800, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Domada', price: 2000, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Couscous viande', price: 2500, unit: 'portion', categorySlug: 'plats-cuisines' },
  { title: 'Riz au gras', price: 1500, unit: 'portion', categorySlug: 'plats-cuisines' },

  // ====== SANDWICHS & BURGERS ======
  { title: 'Burger classique', price: 1500, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Burger double', price: 2500, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Sandwich poulet', price: 1200, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Sandwich thon', price: 1000, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Panini', price: 1500, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Shawarma', price: 1500, unit: 'pièce', categorySlug: 'sandwichs' },
  { title: 'Wrap poulet', price: 1300, unit: 'pièce', categorySlug: 'sandwichs' },

  // ====== GRILLADES & DIBI ======
  { title: 'Dibi mouton', price: 3000, unit: 'portion', categorySlug: 'grillades' },
  { title: 'Dibi poulet', price: 2000, unit: 'portion', categorySlug: 'grillades' },
  { title: 'Brochettes bœuf', price: 1500, unit: 'portion', categorySlug: 'grillades' },
  { title: 'Brochettes poulet', price: 1200, unit: 'portion', categorySlug: 'grillades' },
  { title: 'Brochettes merguez', price: 1500, unit: 'portion', categorySlug: 'grillades' },
  { title: 'Poulet braisé entier', price: 4000, unit: 'pièce', categorySlug: 'grillades' },
  { title: 'Tilapia grillé', price: 3000, unit: 'pièce', categorySlug: 'grillades' },
  { title: 'Côtelettes grillées', price: 3500, unit: 'portion', categorySlug: 'grillades' },

  // ====== GLACES & DESSERTS ======
  { title: 'Glace vanille', price: 500, unit: 'cornet', categorySlug: 'glaces-desserts' },
  { title: 'Glace chocolat', price: 500, unit: 'cornet', categorySlug: 'glaces-desserts' },
  { title: 'Glace coco', price: 400, unit: 'cornet', categorySlug: 'glaces-desserts' },
  { title: 'Sorbet bissap', price: 300, unit: 'cornet', categorySlug: 'glaces-desserts' },
  { title: 'Thiakry (dessert mil)', price: 500, unit: 'bol', categorySlug: 'glaces-desserts' },
  { title: 'Fondant chocolat', price: 1000, unit: 'pièce', categorySlug: 'glaces-desserts' },
  { title: 'Tarte aux fruits', price: 800, unit: 'part', categorySlug: 'glaces-desserts' },
  { title: 'Crème brûlée', price: 1000, unit: 'pièce', categorySlug: 'glaces-desserts' },
]

export async function POST() {
  try {
    // Delete existing data
    await db.purchase.deleteMany()
    await db.listing.deleteMany()
    await db.seller.deleteMany()
    await db.category.deleteMany()

    // Create categories
    const categoryMap: Record<string, string> = {}
    for (const cat of CATEGORIES) {
      const created = await db.category.create({ data: cat })
      categoryMap[cat.slug] = created.id
    }

    // Create sellers
    const sellerIds: string[] = []
    for (const seller of SELLERS) {
      const premiumExpiry = seller.premium !== 'none'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null
      const created = await db.seller.create({
        data: {
          name: seller.name,
          phone: seller.phone,
          password: seller.password,
          quartier: seller.quartier,
          rating: seller.rating,
          sales: seller.sales,
          premium: seller.premium,
          premiumExpiry
        }
      })
      sellerIds.push(created.id)
    }

    // Fetch all sellers for listing creation
    const allSellers = await db.seller.findMany()

    // Create listings in bulk
    const listingsToCreate: Array<{
      title: string; description: string; price: number; unit: string;
      categoryId: string; sellerId: string; quartier: string; isPremium: boolean
    }> = []

    for (const item of LISTINGS_DATA) {
      const numSellers = 2 + Math.floor(Math.random() * 3)
      const shuffled = [...allSellers].sort(() => Math.random() - 0.5)
      const selectedSellers = shuffled.slice(0, numSellers)

      for (const seller of selectedSellers) {
        const variation = 0.8 + Math.random() * 0.4
        const variedPrice = Math.round(item.price * variation / 50) * 50
        const isPremium = seller.premium === 'pro' ? Math.random() > 0.6 : seller.premium === 'basic' ? Math.random() > 0.8 : false

        listingsToCreate.push({
          title: item.title,
          description: `${item.title} de qualité supérieure, disponible à ${seller.quartier}.`,
          price: variedPrice,
          unit: item.unit,
          categoryId: categoryMap[item.categorySlug],
          sellerId: seller.id,
          quartier: seller.quartier,
          isPremium
        })
      }
    }

    // Batch insert listings (100 at a time)
    for (let i = 0; i < listingsToCreate.length; i += 100) {
      await db.listing.createMany({ data: listingsToCreate.slice(i, i + 100) })
    }

    // Create demo purchases
    const allListings = await db.listing.findMany({ take: 30 })
    const purchasesToCreate = allListings.flatMap(listing =>
      Array.from({ length: Math.floor(Math.random() * 3) }).map(() => ({
        buyerPhone: `76${Math.floor(1000000 + Math.random() * 9000000)}`,
        listingId: listing.id,
        sellerId: listing.sellerId,
        price: listing.price,
        title: listing.title,
        quartier: listing.quartier,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }))
    )
    if (purchasesToCreate.length > 0) {
      await db.purchase.createMany({ data: purchasesToCreate })
    }

    const totalListings = await db.listing.count()
    const totalPurchases = await db.purchase.count()
    return NextResponse.json({
      message: 'Base peuplée avec succès !',
      categories: CATEGORIES.length,
      sellers: SELLERS.length,
      listings: totalListings,
      purchases: totalPurchases
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Erreur lors du peuplement' }, { status: 500 })
  }
}
