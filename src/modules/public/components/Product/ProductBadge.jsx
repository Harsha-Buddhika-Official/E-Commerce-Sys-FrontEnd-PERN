const ProductBadge = ({ label, color = '#FE1801' }) => {
  const words = label.split(' ');
  const isTwoWords = words.length === 2;

  return (
    <div
      className="absolute top-0 left-0  z-10"
      style={{ width: '100px', height: '100px', borderTopLeftRadius: '16px' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '-54px',
          width: '180px',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          transform: 'rotate(-45deg)',
          lineHeight: 1.25,
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          ...(!isTwoWords && {
            background: color,
            color: '#fff',
            padding: '6px 0',
          }),
        }}
      >
        {words.map((w, i) => {
          if (!isTwoWords) {
            return <div key={i}>{w}</div>;
          }

          const isFirstWord = i === 0;

          return (
            <div
              key={i}
              style={{
                background: isFirstWord ? color : '#fff',
                color: isFirstWord ? '#fff' : color,
                padding: '5px 0',
                ...(!isFirstWord && {
                  border: `1.5px solid ${color}`,
                  borderTop: 'none',
                }),
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductBadge;