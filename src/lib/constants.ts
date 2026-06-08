export const QUARTIERS = [
  'Yoff', 'Castor', 'Médina', 'Plateau', 'Ouakam', 'Mermoz',
  'Point E', 'Fann', 'Almadies', 'Sacré-Cœur', 'Ngor',
  'Dieuppeul', 'Grand Dakar', 'HLM', 'Biscuiterie', 'Liberté'
]

export const UNITS = [
  'kg', 'litre', 'pièce', 'sachet', 'boîte', 'bouteille',
  'pot', 'sac', 'tasse', 'verre', 'botte', 'douzaine',
  'sachet 100g', 'sachet 500g', 'pot 200ml', 'pot 250g', 'pot 500g',
  'bouteille 1L', 'bouteille 1.5L', 'sac 10kg', 'sac 25kg', 'sac 50kg',
  'sachet 250g', 'sachet 400g', 'sachet 1kg',
  'sachet 10 cubes', 'boîte 25 sachets', 'plateau', 'barquette',
  'paquet', 'paquet 500g', 'flacon', 'tube', 'bol', '6 pièces', 'portion'
]

export function getStarsFromSales(sales: number): number {
  if (sales >= 500) return 5
  if (sales >= 300) return 4.5
  if (sales >= 200) return 4
  if (sales >= 100) return 3.5
  if (sales >= 50) return 3
  if (sales >= 20) return 2.5
  if (sales >= 5) return 2
  return 1
}

export function getPremiumLabel(premium: string): { label: string; color: string } | null {
  if (premium === 'vip') return { label: 'VIP', color: '#10B981' }
  if (premium === 'pro') return { label: 'PRO', color: '#F59E0B' }
  if (premium === 'basic') return { label: 'Premium', color: '#8B5CF6' }
  return null
}
