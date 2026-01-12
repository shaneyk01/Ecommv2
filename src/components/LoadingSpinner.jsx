export default function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizes = {
    small: { spinner: '24px', border: '3px' },
    medium: { spinner: '40px', border: '4px' },
    large: { spinner: '60px', border: '5px' }
  };

  const current = sizes[size];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '16px'
    }}>
      <div
        style={{
          width: current.spinner,
          height: current.spinner,
          border: `${current.border} solid #f3f3f3`,
          borderTop: `${current.border} solid #007bff`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {message && (
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          {message}
        </p>
      )}
    </div>
  );
}
