import React, { useState } from 'react';
import { Select, Checkbox } from 'antd';
import PropTypes from 'prop-types';

const MultiSelectCheckbox = ({
  label,
  id,
  error,
  options = [],
  value = [],
  onChange,
  containerClassName = "",
  selectClassName = "border-gray-300 focus:border-blue-500 focus:ring-0",
  labelClassName = "text-gray-500",
  labelActiveClassName = "text-blue-500",
  labelInactiveClassName = "text-gray-400",
  placeholder = "Seçiniz",
  ...props
}) => {
  // Focus ve dropdown durumlarını takip ediyoruz
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Label'ın ne zaman yukarıda olması gerektiğini kontrol ediyoruz
  const shouldFloatLabel = isFocused || isOpen || (value && value.length > 0);

  // Seçenekleri checkbox'lı formatta hazırlıyoruz
  const formattedOptions = options.map(option => ({
    value: option.value,
    label: (
      <div className="flex items-center w-full py-1.5 px-1">
        <Checkbox checked={value.includes(option.value)}>
          <span className="ml-2">{option.label}</span>
        </Checkbox>
      </div>
    )
  }));

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Select'i çevreleyen border container'ı */}
      <div className={`
        relative 
        border-2 
        rounded-md
        transition-colors
        duration-200
        ${selectClassName}
        ${(isFocused || isOpen) ? 'border-blue-500' : 'border-gray-300'}
      `}>
        <Select
          id={id}
          mode="multiple"
          {...props}
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onDropdownVisibleChange={(visible) => setIsOpen(visible)}
          options={formattedOptions}
          className={`
            w-full
            border-none
            shadow-none
            focus:shadow-none
            pt-3
            pb-1
          `}
          placeholder={placeholder}
          maxTagCount={3}
          maxTagPlaceholder={(omitted) => `+ ${omitted} seçili`}
          dropdownStyle={{ 
            maxHeight: 300, 
            overflow: 'auto',
            padding: '8px'
          }}
          showSearch
          filterOption={(input, option) =>
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.label.props.children.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          menuItemSelectedIcon={null}  // Varsayılan seçim ikonunu kaldırıyoruz
          tagRender={(props) => (
            <span className="inline-flex items-center px-2 py-1 mr-1 text-sm bg-blue-100 text-blue-800 rounded">
              {props.label}
              <span
                className="ml-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  props.onClose();
                }}
              >
                ×
              </span>
            </span>
          )}
        />
        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute 
            left-3
            transition-all 
            duration-200 
            pointer-events-none
            bg-white
            px-1
            ${labelClassName}
            ${shouldFloatLabel
              ? `top-1 text-xs ${labelActiveClassName}` 
              : `top-3 text-base ${labelInactiveClassName}`
            }
          `}
        >
          {label}
        </label>
      </div>
      {/* Hata mesajı */}
      {error && (
        <span className="text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

MultiSelectCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  value: PropTypes.array,
  onChange: PropTypes.func,
  containerClassName: PropTypes.string,
  selectClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  labelActiveClassName: PropTypes.string,
  labelInactiveClassName: PropTypes.string,
  placeholder: PropTypes.string,
  onClose: PropTypes.func,
};

export default MultiSelectCheckbox;