import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserOrders, cancelOrder } from '../services/orderService.js';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(orderId);
      await cancelOrder(orderId, user.uid);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>My Orders</h1>
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="Start shopping to see your orders here!"
          action={() => navigate('/')}
          actionLabel="Browse Products"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ position: 'relative' }}>
              <OrderCard order={order} />
              
              {/* Cancel Order Button */}
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancelling === order.id}
                  style={{
                    marginTop: '12px',
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: cancelling === order.id ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: cancelling === order.id ? 0.6 : 1
                  }}
                >
                  {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
