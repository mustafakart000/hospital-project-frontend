import PropTypes from 'prop-types';
import React, { useState } from 'react';

const CustomInput = ({
  label,
  id,
  error,
  containerClassName = "",
  inputClassName = "border-gray-400 focus:border-blue-500 focus:border-t-2 focus:border-b-2 focus:ring-0",
  labelClassName = "text-gray-500",
  labelActiveClassName = "text-blue-500",
  labelInactiveClassName = "text-gray-600",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || "");

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <input
        id={id}
        {...props}
        className={`
          peer 
          w-full 
          h-9 
          px-2 
          pt-5 
          pb-2 
          text-base 
          rounded-md
          transition-all
          outline-none
          bg-transparent
          autofill:bg-transparent 
          [-webkit-autofill:bg-transparent]
          [&:-webkit-autofill]:bg-transparent
          border-y-2
          border-t-[0.15px]
          border-b-[0.15px]
          
          focus:border-blue-500
         
          ${inputClassName}
        `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder=" "
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
          ${(isFocused || hasValue) 
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

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  labelActiveClassName: PropTypes.string,
  labelInactiveClassName: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default CustomInput;