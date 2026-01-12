import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';import LoadingSpinner from '../components/LoadingSpinner';import { useAuth } from '../hooks/useAuth';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data);
    } catch (err) {
      setError('Product not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // In a real app, you'd manage cart in context or state management
    // For now, we'll just show a success message
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'spin 1s linear infinite'
          }}>
            ⏳
          </div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '40px auto', 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Product Not Found</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Products
        </Link>
        {' > '}
        {product.category && (
          <>
            <span>{product.category}</span>
            {' > '}
          </>
        )}
        <span style={{ color: '#495057' }}>{product.title}</span>
      </div>

      {addedToCart && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          padding: '16px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontWeight: '500'
        }}>
          ✓ Added to cart!
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Product Image */}
        <div>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#e9ecef',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '18px'
            }}>
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {product.category && (
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#495057',
              width: 'fit-content',
              fontWeight: '500'
            }}>
              {product.category}
            </span>
          )}

          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '600',
            color: '#212529'
          }}>
            {product.title}
          </h1>

          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#28a745' 
          }}>
            ${product.price?.toFixed(2)}
          </div>

          <div style={{ 
            fontSize: '16px', 
            lineHeight: '1.6', 
            color: '#495057',
            paddingTop: '16px',
            borderTop: '1px solid #e9ecef'
          }}>
            {product.description}
          </div>

          {/* Quantity Selector */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              Quantity:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#495057'
                }}
              >
                −
              </button>
              <span style={{ 
                minWidth: '60px', 
                textAlign: 'center', 
                fontSize: '18px',
                fontWeight: '500'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#495057'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            style={{
              padding: '16px 32px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              marginTop: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🛒 Add to Cart
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ← Back to Products
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div style={{
        marginTop: '40px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Product Details</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '200px 1fr',
          gap: '16px',
          fontSize: '16px'
        }}>
          <div style={{ fontWeight: '600', color: '#495057' }}>Category:</div>
          <div style={{ color: '#6c757d' }}>{product.category || 'Uncategorized'}</div>
          
          <div style={{ fontWeight: '600', color: '#495057' }}>Product ID:</div>
          <div style={{ color: '#6c757d', fontFamily: 'monospace', fontSize: '14px' }}>
            {product.id}
          </div>
        </div>
      </div>
    </div>
  );
}
