import React, { useState, useRef, useEffect } from 'react';

const DateInput = ({ field, form, ...props }) => {
  const [selectedDate, setSelectedDate] = useState(field.value || null);
  const [step, setStep] = useState('year');
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const yearListRef = useRef(null);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('tr', { month: 'long' }));

  useEffect(() => {
    if (isOpen && yearListRef.current) {
      const targetYear = 2007;
      const currentYear = new Date().getFullYear();
      const index = currentYear - targetYear;
      const itemHeight = 40;
      yearListRef.current.scrollTop = index * itemHeight;
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);
    setStep('year');
  };

  const handleYearSelect = (year) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setStep('month');
  };

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setStep('day');
  };

  const handleDaySelect = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    form.setFieldValue(field.name, newDate);
    setIsOpen(false);
    setStep('year');
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const renderCalendar = () => {
    switch (step) {
      case 'year':
        return (
          <div className="grid grid-cols-4 gap-2 p-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className="p-2 hover:bg-blue-100 rounded"
              >
                {year}
              </button>
            ))}
          </div>
        );
      case 'month':
        return (
          <div className="grid grid-cols-3 gap-2 p-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className="p-2 hover:bg-blue-100 rounded"
              >
                {month}
              </button>
            ))}
          </div>
        );
      case 'day':
        const daysInMonth = getDaysInMonth(selectedDate);
        return (
          <div className="grid grid-cols-7 gap-2 p-2">
            {Array.from({ length: daysInMonth }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleDaySelect(i + 1)}
                className="p-2 hover:bg-blue-100 rounded"
              >
                {i + 1}
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <input
        {...field}
        {...props}
        type="text"
        value={selectedDate ? selectedDate.toLocaleDateString('tr') : ''}
        onClick={handleInputClick}
        readOnly
        className={`w-full p-2 border rounded-md ${
          form.errors[field.name] && form.touched[field.name] ? 'border-red-500' : ''
        }`}
        placeholder="Doğum tarihi seçiniz"
      />
      {isOpen && (
        <div 
          ref={popupRef}
          className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {step === 'year' ? (
            <div 
              ref={yearListRef}
              className="grid grid-cols-4 gap-2 p-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className="p-2 hover:bg-blue-100 rounded text-center"
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            renderCalendar()
          )}
        </div>
      )}
      {form.errors[field.name] && form.touched[field.name] && (
        <div className="text-red-500 text-sm mt-1">{form.errors[field.name]}</div>
      )}
    </div>
  );
};

export default DateInput; 