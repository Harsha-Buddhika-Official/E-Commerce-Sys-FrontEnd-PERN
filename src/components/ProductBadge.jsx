import React from 'react';

const ProductBadge = ({ label }) => {
  return (
    <div 
      className="absolute top-[10px] left-[10px] rounded-full bg-[#FE1801] flex items-center justify-center z-10"
      style={{ width: '50px', height: '50px' }}
    >
      <span 
        className="font-bold text-[11px] leading-[12px] text-center uppercase text-white"
        style={{ fontFamily: 'Inter, sans-serif', width: '40.62px' }}
      >
        {label.split(' ').map((word, index) => (
          <React.Fragment key={index}>
            {word}
            {index < label.split(' ').length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

export default ProductBadge;
