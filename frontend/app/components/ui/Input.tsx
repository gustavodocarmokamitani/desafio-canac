import React, { InputHTMLAttributes } from 'react';
 
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { 
}

export default function Input(props: InputProps) {
  const isDisabled = props.disabled;
  return (
    <input 
      {...props} 
      style={{ 
        padding: '10px 25px', 
        fontSize: '16px', 
        border: '1px solid #f0f0f0', 
        borderRadius: '15px',
        width: '100%',
        cursor: isDisabled ? 'not-allowed' : 'text',
        opacity: isDisabled ? 0.6 : 1,
      }}
    />
  );
}