import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC57dybgYrAuOoBwxIxloUAtibHUBth_hM",
  authDomain: "ecomm-11844.firebaseapp.com",
  projectId: "ecomm-11844",
  storageBucket: "ecomm-11844.firebasestorage.app",
  messagingSenderId: "311161704372",
  appId: "1:311161704372:web:6ee2d1e56a46a4d0c1ace1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    title: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
  },
  {
    title: "Smart Watch",
    description: "Advanced fitness tracker with heart rate monitor, GPS, and smartphone notifications.",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
  },
  {
    title: "Running Shoes",
    description: "Lightweight athletic shoes with responsive cushioning and breathable mesh upper.",
    price: 89.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"
  },
  {
    title: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe, brew strength control, and auto-shutoff.",
    price: 79.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop"
  },
  {
    title: "Yoga Mat",
    description: "Non-slip premium yoga mat with extra cushioning and carrying strap included.",
    price: 34.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop"
  },
  {
    title: "Laptop Backpack",
    description: "Water-resistant laptop backpack with USB charging port and multiple compartments.",
    price: 59.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
  },
  {
    title: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness, USB charging port, and modern design.",
    price: 45.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop"
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable waterproof speaker with 360° sound and 12-hour battery life.",
    price: 69.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"
  },
  {
    title: "Water Bottle",
    description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours.",
    price: 24.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop"
  },
  {
    title: "Plant Pot Set",
    description: "Set of 3 ceramic plant pots with drainage holes and bamboo saucers.",
    price: 39.99,
    category: "Home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop"
  }
];

async function addProducts() {
  console.log('Adding sample products to Firestore...\n');
  
  try {
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp()
      });
      console.log(`✓ Added: ${product.title} (ID: ${docRef.id})`);
    }
    
    console.log('\n✅ Successfully added all sample products!');
    console.log('You can now view them in your app at http://localhost:3000');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addProducts();
