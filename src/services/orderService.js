import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc,
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new order
 */
export const createOrder = async (userId, items, total) => {
  try {
    const ordersRef = collection(db, 'orders');
    const orderData = {
      userId,
      items,
      total,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(ordersRef, orderData);
    
    return {
      id: docRef.id,
      ...orderData
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to JavaScript Date
      createdAt: doc.data().createdAt?.toDate()
    }));
    
    // Sort by createdAt in memory instead of Firestore query
    return orders.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt - a.createdAt;
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    return {
      id: orderDoc.id,
      ...orderDoc.data(),
      createdAt: orderDoc.data().createdAt?.toDate()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Get all orders (admin function)
 */
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

/**
 * Update order status (admin function)
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    
    return {
      id: orderId,
      status
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Cancel an order (user can only cancel their own orders)
 */
export const cancelOrder = async (orderId, userId) => {
  try {
    // First verify the order belongs to the user
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    const orderData = orderDoc.data();
    
    if (orderData.userId !== userId) {
      throw new Error('Unauthorized: Cannot cancel another user\'s order');
    }
    
    if (orderData.status === 'cancelled') {
      throw new Error('Order is already cancelled');
    }
    
    if (orderData.status === 'delivered') {
      throw new Error('Cannot cancel a delivered order');
    }
    
    // Update order status to cancelled
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { 
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });
    
    return {
      id: orderId,
      status: 'cancelled'
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};