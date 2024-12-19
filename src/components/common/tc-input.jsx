import PropTypes from 'prop-types';
import React, { useState } from 'react';

const TcInput = ({
  label = "TC Kimlik",
  id = "tcKimlik",
  error,
  containerClassName = "w-full",
  inputClassName = "border-gray-400 focus:border-blue-500 focus:ring-0",
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
    for (let i = 0; i < numbers.length && i < 11; i += 3) {
      parts.push(numbers.slice(i, Math.min(i + 3, 11)));
    }
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
          px-3 
          pt-5 
          pb-2 
          text-base 
          rounded-md
          transition-all
          outline-none
          bg-transparent
          border-y-2
          border-t-[0.15px]
          border-b-[0.15px]
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
          left-3
          transition-all 
          duration-200 
          pointer-events-none
          ${labelClassName}
          ${(isFocused || value) 
            ? `top-0.5 text-xs ${labelActiveClassName}` 
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

TcInput.propTypes = {
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

export default TcInput;