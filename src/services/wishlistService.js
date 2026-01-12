import { db } from '../firebase.js';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Add a product to user's wishlist
 */
export async function addToWishlist(userId, productId) {
  const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
  
  await setDoc(wishlistRef, {
    userId,
    productId,
    addedAt: new Date().toISOString()
  });
}

/**
 * Remove a product from user's wishlist
 */
export async function removeFromWishlist(userId, productId) {
  const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
  await deleteDoc(wishlistRef);
}

/**
 * Check if a product is in user's wishlist
 */
export async function isInWishlist(userId, productId) {
  const wishlistRef = doc(db, 'wishlists', `${userId}_${productId}`);
  const snapshot = await getDoc(wishlistRef);
  return snapshot.exists();
}

/**
 * Get all products in user's wishlist
 */
export async function getUserWishlist(userId) {
  const q = query(
    collection(db, 'wishlists'),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Toggle product in wishlist (add if not exists, remove if exists)
 */
export async function toggleWishlist(userId, productId) {
  const inWishlist = await isInWishlist(userId, productId);
  
  if (inWishlist) {
    await removeFromWishlist(userId, productId);
    return false;
  } else {
    await addToWishlist(userId, productId);
    return true;
  }
}
