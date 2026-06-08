const ProductBadge = ({ label, color = '#FE1801' }) => {
  const words = label.split(' ');

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden z-10"
      style={{ width: '80px', height: '80px', borderTopLeftRadius: '16px' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '18px',
          left: '-22px',
          width: '100px',
          background: color,
          color: '#fff',
          textAlign: 'center',
          fontSize: '9.5px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '5px 0',
          transform: 'rotate(-45deg)',
          lineHeight: 1.2,
        }}
      >
        {words.map((w, i) => <div key={i}>{w}</div>)}
      </div>
    </div>
  );
};

export default ProductBadge;