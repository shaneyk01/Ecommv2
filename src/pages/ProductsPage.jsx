import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProducts } from '../services/productService.js';
import { createOrder } from '../services/orderService.js';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setOrdering(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      await createOrder(user.uid, orderItems, calculateTotal());
      
      setCart([]);
      setOrderSuccess(true);
      setShowCart(false);
      
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error(err);
    } finally {
      setOrdering(false);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1>Products</h1>
        
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            position: 'relative'
          }}
        >
          🛒 Cart
          {cartItemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            minWidth: '200px',
            cursor: 'pointer'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {orderSuccess && (
        <div style={{
          padding: '16px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          ✓ Order placed successfully! Check "My Orders" to view your order.
        </div>
      )}

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

      {showCart && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ marginTop: 0 }}>Shopping Cart</h2>
          
          {cart.length === 0 ? (
            <p style={{ color: '#666' }}>Your cart is empty</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {cart.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveFromCart}
                  />
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '2px solid #eee'
              }}>
                <strong style={{ fontSize: '20px' }}>Total:</strong>
                <strong style={{ fontSize: '24px', color: '#28a745' }}>
                  ${calculateTotal().toFixed(2)}
                </strong>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={ordering || !user}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500',
                  marginTop: '20px'
                }}
              >
                {ordering ? 'Processing...' : user ? 'Checkout' : 'Login to Checkout'}
              </button>
            </>
          )}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            {products.length === 0 
              ? 'No products available yet. Check back soon!'
              : 'No products match your search criteria.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: '16px', 
            color: '#666',
            fontSize: '14px'
          }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
