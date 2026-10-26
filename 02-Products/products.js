// GreenBasket Catalog & Categories
const photo = (id, w = 600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const categories = [
  { name: 'Vegetables', count: '120+ items', image: photo('photo-1540420773420-3366772f4999', 450) },
  { name: 'Fruits', count: '80+ items', image: photo('photo-1610832958506-aa56368176cf', 450) },
  { name: 'Herbs & Greens', count: '60+ items', image: photo('photo-1466692476868-aef1dfb1e735', 450) },
  { name: 'Dairy & Eggs', count: '40+ items', image: photo('photo-1563636619-e9143da7973b', 450) },
  { name: 'Nuts & Seeds', count: '50+ items', image: photo('photo-1505576399274-565b52d4ac71', 450) },
];

export const initialProducts = [
  { id: 1, name: 'Organic Tomatoes', unit: '250g / pack', price: 2.49, category: 'Vegetables', rating: 4.9, reviews: 29, stock: 45, image: photo('photo-1546094096-0df4bcaaa337', 500), tag: 'Farm fresh' },
  { id: 2, name: 'Fresh Carrots', unit: '1kg / bag', price: 1.49, category: 'Vegetables', rating: 4.8, reviews: 46, stock: 30, image: photo('photo-1445282768818-728615cc910a', 500), tag: 'Best seller' },
  { id: 3, name: 'Green Spinach', unit: '1 bunch', price: 1.29, category: 'Herbs & Greens', rating: 4.9, reviews: 63, stock: 25, image: photo('photo-1576045057995-568f588f82fb', 500), tag: 'Organic' },
  { id: 4, name: 'Red Apples', unit: '500g / bag', price: 2.99, category: 'Fruits', rating: 5.0, reviews: 80, stock: 50, image: photo('photo-1560806887-1e4cd0b6cbd6', 500), tag: 'Sweet & crisp' },
  { id: 5, name: 'Farm Eggs (6pcs)', unit: '6 eggs / pack', price: 1.99, category: 'Dairy & Eggs', rating: 4.9, reviews: 97, stock: 60, image: photo('photo-1506976785307-8732e854ad03', 500), tag: 'Free range' },
  { id: 6, name: 'Sweet Oranges', unit: '1kg / bag', price: 2.79, category: 'Fruits', rating: 4.7, reviews: 114, stock: 35, image: photo('photo-1547514701-42782101795e', 500), tag: 'Vitamin C' },
  { id: 7, name: 'Garden Herbs', unit: 'Fresh bunch', price: 1.59, category: 'Herbs & Greens', rating: 4.8, reviews: 131, stock: 20, image: photo('photo-1501004318641-b39e6451bec6', 500), tag: 'Just picked' },
  { id: 8, name: 'Mixed Nuts', unit: '200g / pack', price: 3.49, category: 'Nuts & Seeds', rating: 4.9, reviews: 148, stock: 40, image: photo('photo-1505576399274-565b52d4ac71', 500), tag: 'Energy boost' },
  { id: 9, name: 'Crisp Broccoli', unit: '500g / head', price: 2.19, category: 'Vegetables', rating: 4.8, reviews: 38, stock: 22, image: photo('photo-1459411621453-7b03977f4bfc', 500), tag: 'Superfood' },
  { id: 10, name: 'Organic Bananas', unit: '1 bunch (6pcs)', price: 1.89, category: 'Fruits', rating: 4.9, reviews: 52, stock: 45, image: photo('photo-1571771894821-ce9b6c11b08e', 500), tag: 'Potassium Rich' },
  { id: 11, name: 'Pure Farm Milk', unit: '1 Liter bottle', price: 2.29, category: 'Dairy & Eggs', rating: 5.0, reviews: 75, stock: 28, image: photo('photo-1550583724-b2692b85b150', 500), tag: 'Grass fed' },
  { id: 12, name: 'Natural Chia Seeds', unit: '250g / pack', price: 4.19, category: 'Nuts & Seeds', rating: 4.9, reviews: 41, stock: 18, image: photo('photo-1514733670139-4d87a1941d55', 500), tag: 'Omega-3 Rich' },
];

export const products = initialProducts;