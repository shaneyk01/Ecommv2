export default function EmptyState({ 
  icon = '📦', 
  title = 'No items found', 
  message = 'There are no items to display.',
  action,
  actionLabel 
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
        {icon}
      </div>
      <h2 style={{ 
        color: '#333', 
        marginBottom: '8px',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        {title}
      </h2>
      <p style={{ 
        color: '#666', 
        marginBottom: '24px',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        {message}
      </p>
      {action && actionLabel && (
        <button
          onClick={action}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
