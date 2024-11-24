import React from 'react'


    const TelefonInput = ({ field, form, ...props }) => {
        const handleChange = (e) => {
          const input = e.target.value.replace(/\D/g, '');
          if (input.length <= 11) {
            form.setFieldValue(field.name, input);
          }
        };
      
        return (
          <div className="relative">
            <input
              {...field}
              {...props}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={handleChange}
              placeholder={form.errors[field.name] && !form.touched[field.name] ? "Telefon numarası zorunludur" : "5XX XXX XX XX"}
              className={`w-full p-2 pr-8 border rounded-md focus:outline-none focus:ring-2 ${
                form.errors[field.name] && form.touched[field.name] 
                  ? "border-red-500 focus:ring-red-500" 
                  : field.value && field.value.length >= 10 
                    ? "border-green-500 focus:ring-green-500"
                    : "focus:ring-blue-500"
              }`}
            />
            {field.value && field.value.length >= 10 && !form.errors[field.name] && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
            )}
          </div>
        );
      };
      


export default TelefonInput