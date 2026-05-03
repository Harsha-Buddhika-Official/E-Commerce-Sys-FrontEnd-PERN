const ProductBadge = ({ label }) => {
  // Calculate font size based on text length
  const fontSize = 10;

  const words = label.split(' ');
  const hasSpace = label.includes(' ');

  return (
    <div 
      className="absolute top-[10px] left-[10px] rounded-full bg-[#FE1801] flex items-center justify-center z-10"
      style={{ width: '60px', height: '60px' }}
    >
      <span 
        className="font-bold text-center uppercase text-white px-2"
        style={{ 
          fontFamily: 'Inter, sans-serif', 
          fontSize: `${fontSize}px`,
          lineHeight: '1.1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {hasSpace ? (
          words.map((word, index) => (
            <div key={index}>{word}</div>
          ))
        ) : (
          label
        )}
      </span>
    </div>
  );
};

export default ProductBadge;
