import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toggleWishlist, isInWishlist } from '../services/wishlistService.js';

export default function ProductCard({ product, onAddToCart }) {
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, product.id]);

  const checkWishlistStatus = async () => {
    try {
      const status = await isInWishlist(user.uid, product.id);
      setInWishlist(status);
    } catch (err) {
      console.error('Failed to check wishlist status:', err);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      setWishlistLoading(true);
      const newStatus = await toggleWishlist(user.uid, product.id);
      setInWishlist(newStatus);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      overflow: 'hidden',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }}
    >
      {/* Wishlist Button */}
      {user && (
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {inWishlist ? '💝' : '🤍'}
        </button>
      )}
      
      <Link 
        to={`/product/${product.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title}
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '220px',
            backgroundColor: '#e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d'
          }}>
            No Image
          </div>
        )}
      </Link>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <Link 
          to={`/product/${product.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#212529' }}>
            {product.title}
          </h3>
        </Link>
        
        <p style={{ 
          margin: 0, 
          color: '#6c757d',
          fontSize: '14px',
          lineHeight: '1.5',
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>
        
        {product.category && (
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#495057',
            width: 'fit-content',
            fontWeight: '500'
          }}>
            {product.category}
          </span>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <strong style={{ fontSize: '24px', color: '#28a745', fontWeight: '700' }}>
            ${product.price?.toFixed(2)}
          </strong>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            style={{
              padding: '10px 18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
