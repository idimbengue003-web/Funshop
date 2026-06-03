import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const QUARTIERS = [
  'Yoff', 'Castor', 'Médina', 'Plateau', 'Ouakam', 'Mermoz',
  'Point E', 'Fann', 'Almadies', 'Sacré-Cœur', 'Ngor',
  'Dieuppeul', 'Grand Dakar', 'HLM', 'Biscuiterie', 'Liberté'
]

const CATEGORIES = [
  { name: 'Lait & Produits Laitiers', slug: 'lait', icon: '🥛', color: '#3B82F6' },
  { name: 'Viande', slug: 'viande', icon: '🥩', color: '#EF4444' },
  { name: 'Poisson & Fruits de Mer', slug: 'poisson', icon: '🐟', color: '#06B6D4' },
  { name: 'Légumes', slug: 'legumes', icon: '🥬', color: '#22C55E' },
  { name: 'Fruits', slug: 'fruits', icon: '🍎', color: '#F97316' },
  { name: 'Boissons', slug: 'boissons', icon: '🥤', color: '#8B5CF6' },
  { name: 'Céréales & Grains', slug: 'cereales', icon: '🌾', color: '#EAB308' },
  { name: 'Épices & Condiments', slug: 'epices', icon: '🌶️', color: '#DC2626' },
  { name: 'Produits Transformés', slug: 'transformes', icon: '🫙', color: '#EC4899' },
  { name: 'Huile & Graisses', slug: 'huiles', icon: '🫒', color: '#84CC16' },
]

const SELLERS = [
  { name: 'Mamadou Diop', phone: '771234567', password: 'pass123', quartier: 'Yoff', rating: 4.5, sales: 120 },
  { name: 'Fatou Sow', phone: '772345678', password: 'pass123', quartier: 'Castor', rating: 4.8, sales: 200 },
  { name: 'Ibrahima Ndiaye', phone: '773456789', password: 'pass123', quartier: 'Médina', rating: 4.2, sales: 85 },
  { name: 'Aissatou Ba', phone: '774567890', password: 'pass123', quartier: 'Plateau', rating: 4.7, sales: 150 },
  { name: 'Ousmane Fall', phone: '775678901', password: 'pass123', quartier: 'Ouakam', rating: 4.0, sales: 60 },
  { name: 'Mariama Diallo', phone: '776789012', password: 'pass123', quartier: 'Mermoz', rating: 4.6, sales: 175 },
  { name: 'Moussa Sy', phone: '777890123', password: 'pass123', quartier: 'Point E', rating: 4.3, sales: 90 },
  { name: 'Khady Wade', phone: '778901234', password: 'pass123', quartier: 'Fann', rating: 4.9, sales: 250 },
  { name: 'Amadou Mbaye', phone: '779012345', password: 'pass123', quartier: 'Almadies', rating: 4.1, sales: 70 },
  { name: 'Aminata Gueye', phone: '770123456', password: 'pass123', quartier: 'Sacré-Cœur', rating: 4.4, sales: 110 },
  { name: 'Cheikh Seck', phone: '781234567', password: 'pass123', quartier: 'Ngor', rating: 4.6, sales: 130 },
  { name: 'Diodio Sarr', phone: '782345678', password: 'pass123', quartier: 'Dieuppeul', rating: 4.3, sales: 95 },
  { name: 'Pape Thiam', phone: '783456789', password: 'pass123', quartier: 'Grand Dakar', rating: 4.5, sales: 140 },
  { name: 'Ndeye Mbaye', phone: '784567890', password: 'pass123', quartier: 'HLM', rating: 4.7, sales: 180 },
  { name: 'Saliou Camara', phone: '785678901', password: 'pass123', quartier: 'Biscuiterie', rating: 4.2, sales: 65 },
]

const LISTINGS_DATA = [
  // Lait & Produits Laitiers
  { title: 'Lait frais pasteurisé', price: 500, unit: 'litre', categorySlug: 'lait' },
  { title: 'Lait caillé (Sow)', price: 400, unit: 'litre', categorySlug: 'lait' },
  { title: 'Yaourt nature', price: 300, unit: 'pot 250ml', categorySlug: 'lait' },
  { title: 'Fromage cottage', price: 1500, unit: 'kg', categorySlug: 'lait' },
  { title: 'Lait concentré sucré', price: 800, unit: 'boîte', categorySlug: 'lait' },
  { title: 'Beurre frais', price: 2000, unit: 'kg', categorySlug: 'lait' },
  { title: 'Crème fraîche', price: 1200, unit: 'pot 200ml', categorySlug: 'lait' },
  { title: 'Lait en poudre', price: 3500, unit: 'sachet 400g', categorySlug: 'lait' },

  // Viande
  { title: 'Viande de bœuf', price: 4500, unit: 'kg', categorySlug: 'viande' },
  { title: 'Viande de mouton', price: 5500, unit: 'kg', categorySlug: 'viande' },
  { title: 'Poulet fermier', price: 3500, unit: 'pièce', categorySlug: 'viande' },
  { title: 'Poulet congelé', price: 2200, unit: 'pièce', categorySlug: 'viande' },
  { title: 'Dibi mouton', price: 6000, unit: 'kg', categorySlug: 'viande' },
  { title: 'Viande de chèvre', price: 5000, unit: 'kg', categorySlug: 'viande' },
  { title: 'Foie de bœuf', price: 3000, unit: 'kg', categorySlug: 'viande' },
  { title: 'Merguez', price: 2500, unit: 'kg', categorySlug: 'viande' },

  // Poisson & Fruits de Mer
  { title: 'Thiass (carpe)', price: 2000, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Merou', price: 5000, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Crevettes fraîches', price: 8000, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Dorade', price: 3500, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Sardine fraîche', price: 1500, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Poulpe', price: 4000, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Maquereau', price: 2500, unit: 'kg', categorySlug: 'poisson' },
  { title: 'Thon frais', price: 4500, unit: 'kg', categorySlug: 'poisson' },

  // Légumes
  { title: 'Tomates', price: 500, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Oignons', price: 400, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Pommes de terre', price: 450, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Manioc', price: 350, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Patate douce', price: 400, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Choux', price: 500, unit: 'pièce', categorySlug: 'legumes' },
  { title: 'Aubergines', price: 600, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Gombo', price: 700, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Poivrons', price: 800, unit: 'kg', categorySlug: 'legumes' },
  { title: 'Salade', price: 300, unit: 'pièce', categorySlug: 'legumes' },

  // Fruits
  { title: 'Mangues (Kent)', price: 500, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Bananes', price: 400, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Oranges', price: 350, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Papayes', price: 600, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Ananas', price: 500, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Pastèque', price: 800, unit: 'pièce', categorySlug: 'fruits' },
  { title: 'Citrons', price: 300, unit: 'kg', categorySlug: 'fruits' },
  { title: 'Dattes', price: 2000, unit: 'kg', categorySlug: 'fruits' },

  // Boissons
  { title: 'Bissap', price: 200, unit: 'bouteille 1L', categorySlug: 'boissons' },
  { title: 'Bouyi (jus de baobab)', price: 250, unit: 'bouteille 1L', categorySlug: 'boissons' },
  { title: 'Café Touba', price: 150, unit: 'tasse', categorySlug: 'boissons' },
  { title: 'Ataya (thé)', price: 100, unit: 'verre', categorySlug: 'boissons' },
  { title: 'Jus de gingembre', price: 300, unit: 'bouteille 1L', categorySlug: 'boissons' },
  { title: 'Jus de mangue frais', price: 350, unit: 'bouteille 1L', categorySlug: 'boissons' },
  { title: 'Eau minérale', price: 250, unit: 'bouteille 1.5L', categorySlug: 'boissons' },
  { title: 'Sodas divers', price: 300, unit: 'bouteille', categorySlug: 'boissons' },

  // Céréales & Grains
  { title: 'Riz brisé (10kg)', price: 6500, unit: 'sac 10kg', categorySlug: 'cereales' },
  { title: 'Mil', price: 500, unit: 'kg', categorySlug: 'cereales' },
  { title: 'Maïs', price: 400, unit: 'kg', categorySlug: 'cereales' },
  { title: 'Sorgho', price: 350, unit: 'kg', categorySlug: 'cereales' },
  { title: 'Fonio', price: 1200, unit: 'kg', categorySlug: 'cereales' },
  { title: 'Couscous de mil', price: 600, unit: 'kg', categorySlug: 'cereales' },
  { title: 'Farine de blé', price: 700, unit: 'kg', categorySlug: 'cereales' },

  // Épices & Condiments
  { title: 'Piment en poudre', price: 500, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Maggi cubes', price: 100, unit: 'sachet 10 cubes', categorySlug: 'epices' },
  { title: 'Sel iodé', price: 150, unit: 'sachet 500g', categorySlug: 'epices' },
  { title: 'Poivre noir', price: 800, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Gingembre en poudre', price: 600, unit: 'sachet 100g', categorySlug: 'epices' },
  { title: 'Moutarde locale', price: 400, unit: 'pot', categorySlug: 'epices' },
  { title: 'Vinaigre', price: 300, unit: 'bouteille', categorySlug: 'epices' },

  // Produits Transformés
  { title: 'Mballax (pâte d\'arachide)', price: 500, unit: 'pot', categorySlug: 'transformes' },
  { title: 'Conserve de tomate', price: 350, unit: 'boîte', categorySlug: 'transformes' },
  { title: 'Sardine en boîte', price: 400, unit: 'boîte', categorySlug: 'transformes' },
  { title: 'Corned beef', price: 1500, unit: 'boîte', categorySlug: 'transformes' },
  { title: 'Café en poudre', price: 1200, unit: 'sachet 250g', categorySlug: 'transformes' },
  { title: 'Sucre', price: 700, unit: 'kg', categorySlug: 'transformes' },

  // Huile & Graisses
  { title: 'Huile d\'arachide', price: 1500, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile de palme', price: 1200, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Huile végétale', price: 1000, unit: 'litre', categorySlug: 'huiles' },
  { title: 'Margarine', price: 800, unit: 'pot 500g', categorySlug: 'huiles' },
]

export async function POST() {
  try {
    // Check if already seeded
    const existingCategories = await db.category.count()
    if (existingCategories > 0) {
      return NextResponse.json({ message: 'Base déjà peuplée', categories: existingCategories })
    }

    // Create categories
    const categoryMap: Record<string, string> = {}
    for (const cat of CATEGORIES) {
      const created = await db.category.create({ data: cat })
      categoryMap[cat.slug] = created.id
    }

    // Create sellers
    const sellerIds: string[] = []
    for (const seller of SELLERS) {
      const created = await db.seller.create({ data: seller })
      sellerIds.push(created.id)
    }

    // Create listings - distribute across sellers with varied prices
    for (const item of LISTINGS_DATA) {
      // Each item gets 2-4 sellers with slightly different prices
      const numSellers = 2 + Math.floor(Math.random() * 3)
      const selectedSellers = [...sellerIds].sort(() => Math.random() - 0.5).slice(0, numSellers)

      for (const sellerId of selectedSellers) {
        const seller = await db.seller.findUnique({ where: { id: sellerId } })
        if (!seller) continue

        // Price variation: -20% to +20%
        const variation = 0.8 + Math.random() * 0.4
        const variedPrice = Math.round(item.price * variation / 50) * 50 // Round to nearest 50

        await db.listing.create({
          data: {
            title: item.title,
            description: `${item.title} de qualité, disponible à ${seller.quartier}. Frais et livrable.`,
            price: variedPrice,
            unit: item.unit,
            categoryId: categoryMap[item.categorySlug],
            sellerId,
            quartier: seller.quartier
          }
        })
      }
    }

    const totalListings = await db.listing.count()
    return NextResponse.json({
      message: 'Base peuplée avec succès !',
      categories: CATEGORIES.length,
      sellers: SELLERS.length,
      listings: totalListings
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Erreur lors du peuplement' }, { status: 500 })
  }
}
