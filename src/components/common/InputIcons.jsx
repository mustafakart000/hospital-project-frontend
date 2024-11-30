import React from 'react';
import PropTypes from 'prop-types';

export const CheckIcon = () => (
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
);

export const InputWrapper = ({ children, showCheck }) => (
  <div className="relative">
    {children}
    {showCheck && <CheckIcon />}
  </div>
);

InputWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  showCheck: PropTypes.bool
};
