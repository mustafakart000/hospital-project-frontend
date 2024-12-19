import PropTypes from 'prop-types';
import React, { useState } from 'react';

const PhoneInput = ({
  label = "Telefon",
  id = "telefon",
  error,
  containerClassName = "w-full ",
  inputClassName = "border-gray-400 focus:border-blue-500 focus:ring-0 pt-3 pl-2",
  labelClassName = "text-gray-500",
  labelActiveClassName = "text-blue-500",
  labelInactiveClassName = "text-gray-600",
  value = "",
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatDisplay = (input) => {
    const numbers = input.replace(/\D/g, '');
    const parts = [];
    
    // İlk 3 hane
    if (numbers.length > 0) parts.push(numbers.slice(0, 3));
    // İkinci 3 hane
    if (numbers.length > 3) parts.push(numbers.slice(3, 6));
    // Sonraki 2 hane
    if (numbers.length > 6) parts.push(numbers.slice(6, 8));
    // Son 2 hane
    if (numbers.length > 8) parts.push(numbers.slice(8, 10));
    
    return parts.join(' ');
  };

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onChange) {
      const cleanValue = e.target.value.replace(/\D/g, '');
      onChange({
        ...e,
        target: { ...e.target, value: cleanValue }
      });
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const cleanValue = input.replace(/\D/g, '').slice(0, 11);
    
    if (onChange) {
      // Önce temiz değeri parent'a gönder
      onChange({
        ...e,
        target: { ...e.target, value: cleanValue }
      });
    }
  };

  const displayValue = formatDisplay(value);

  return (
    <div className={`relative ${containerClassName}`}>
      <input
        id={id}
        {...props}
        value={displayValue}
        onChange={handleChange}
        className={`
          peer 
          w-full 
          h-9 
          text-base 
          rounded-md
          transition-all
          outline-none
          bg-transparent
          px-2
          border-y-2
          border-t-[0.15px]
          border-b-[0.15px]
          focus:border-blue-500
          ${inputClassName}
        `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" "
        maxLength={13}
        inputMode="numeric"
      />
      <label
        htmlFor={id}
        className={`
          absolute 
          left-2
          transition-all 
          duration-200 
          pointer-events-none
          ${labelClassName}
          ${(isFocused || value) 
            ? `top-0.7 text-xs ${labelActiveClassName}` 
            : `top-1.5 text-base ${labelInactiveClassName}`
          }
        `}
      >
        {label}
      </label>
      {error && (
        <span className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

PhoneInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  labelActiveClassName: PropTypes.string,
  labelInactiveClassName: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default PhoneInput;