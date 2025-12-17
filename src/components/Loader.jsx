import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
