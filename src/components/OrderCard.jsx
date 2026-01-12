export default function OrderCard({ order }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #eee'
      }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0' }}>Order #{order.id.slice(0, 8)}</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {formatDate(order.createdAt)}
          </p>
        </div>
        
        <span style={{
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: getStatusColor(order.status) + '20',
          color: getStatusColor(order.status),
          textTransform: 'capitalize'
        }}>
          {order.status}
        </span>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Items:</h4>
        {order.items.map((item, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <span style={{ color: '#495057' }}>
              {item.title} × {item.quantity}
            </span>
            <span style={{ fontWeight: '500' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '2px solid #eee'
      }}>
        <strong style={{ fontSize: '18px' }}>Total:</strong>
        <strong style={{ fontSize: '20px', color: '#28a745' }}>
          ${order.total.toFixed(2)}
        </strong>
      </div>
    </div>
  );
}
