import React from 'react';

const Icon = ({ variant: Variant, size = 24, color = 'text-current', className = '' }) => {
  return (
    <Variant 
      style={{ width: size, height: size }}
      className={`${color} ${className}`}
    />
  );
};
  

export default Icon;
