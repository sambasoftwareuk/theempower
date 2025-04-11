import React from 'react';

const Icon = ({ variant: Variant, size = 24, color = 'currentColor' }) => {
    return (
      <Variant 
        style={{ width: size, height: size, fill: color }}
      />
    );
  };
  

export default Icon;
