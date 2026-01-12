export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white',
      alignItems: 'center'
    }}>
      {item.image && (
        <img 
          src={item.image} 
          alt={item.title}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      )}
      
      <div style={{ flexGrow: 1 }}>
        <h4 style={{ margin: '0 0 8px 0' }}>{item.title}</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          ${item.price.toFixed(2)} each
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '4px'
      }}>
        <button
          onClick={handleDecrease}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          −
        </button>
        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '500' }}>
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          style={{
            width: '28px',
            height: '28px',
            border: 'none',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          +
        </button>
      </div>
      
      <div style={{ 
        minWidth: '80px', 
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: '18px'
      }}>
        ${subtotal.toFixed(2)}
      </div>
      
      <button
        onClick={() => onRemove(item.id)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Remove
      </button>
    </div>
  );
}
