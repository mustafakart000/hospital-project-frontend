import React from 'react';
import PropTypes from 'prop-types';

const TCKimlikInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    
    if (input.length <= 11) {
      form.setFieldValue(field.name, input);
      form.setFieldTouched(field.name, true);
      
      if (input.length === 11) {
        if (!/^[1-9][0-9]{10}$/.test(input)) {
          form.setFieldError(field.name, "Geçerli bir TC Kimlik numarası giriniz");
        } else {
          form.setFieldError(field.name, undefined);
        }
      } else if (input.length > 0) {
        form.setFieldError(field.name, "TC Kimlik numarası 11 haneli olmalıdır");
      }
    }
  };

  const formatTCKimlik = (value) => {
    if (!value) return '';
    const parts = [];
    let remaining = value;

    while (remaining.length > 0) {
      parts.push(remaining.slice(0, 3));
      remaining = remaining.slice(3);
    }

    return parts.join(' ');
  };

  const isValid = field.value && field.value.length === 11 && !form.errors[field.name];

  return (
    <div className="relative">
      <div className="relative">
        <input
          {...field}
          {...props}
          type="text"
          autoComplete="off"
          maxLength={14}
          onChange={handleChange}
          value={formatTCKimlik(field.value)}
          placeholder="11 haneli TC Kimlik No giriniz"
          className={`w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-2 ${
            form.errors[field.name] && form.touched[field.name] 
              ? "border-red-500 focus:ring-red-500" 
              : isValid
                ? "border-green-500 focus:ring-green-500"
                : "focus:ring-blue-500"
          }`}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
        />
        {isValid && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg 
              className="w-5 h-5 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      {form.errors[field.name] && form.touched[field.name] && (
        <div className="text-red-500 text-sm mt-1">{form.errors[field.name]}</div>
      )}
      {field.value && field.value.length < 11 && (
        <div className="mt-2 text-sm text-gray-500">
          {`${11 - field.value.length} hane kaldı`}
        </div>
      )}
    </div>
  );
};

TCKimlikInput.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    setFieldError: PropTypes.func.isRequired,
    errors: PropTypes.object,
    touched: PropTypes.object
  }).isRequired
};

export default TCKimlikInput;