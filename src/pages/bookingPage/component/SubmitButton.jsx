import React from 'react';

export function SubmitButton() {
  return (
    <div className="mt-8 flex justify-center ">
      <button
        type="submit"
        style={{ backgroundColor: '#0097A7' }}
        className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        احجز الموعد
      </button>
    </div>
  );
}
