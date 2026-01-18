import React from 'react';

const Button = ({
  isLoading,
  isDisabled,
  onClick,
  children,
  color = 'blue',
}) => {
  // Define color mappings
  const colorClasses = {
    blue: {
      base: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      loading: 'bg-blue-400',
    },
    red: {
      base: 'bg-red-500',
      hover: 'hover:bg-red-600',
      loading: 'bg-red-400',
    },
    emerald: {
      base: 'bg-emerald-500',
      hover: 'hover:bg-emerald-600',
      loading: 'bg-emerald-400',
    },
    indigo: {
      base: 'bg-indigo-500',
      hover: 'hover:bg-indigo-600',
      loading: 'bg-indigo-400',
    },
    gray: {
      base: 'bg-gray-500',
      hover: 'hover:bg-gray-600',
      loading: 'bg-gray-400',
    },
    yellow: {
      base: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      loading: 'bg-yellow-400',
    },
    // Add more colors as needed
  };

  const { base, hover, loading } = colorClasses[color] || colorClasses.blue; // Default to blue if color is not found

  return (
    <button
      onClick={onClick}
      disabled={isLoading || isDisabled}
      className={`flex items-center justify-center px-4 py-1 font-semibold text-white rounded-lg shadow-md 
                        transition duration-300 ease-in-out transform 
                        ${base} ${hover} focus:outline-none focus:ring-2 focus:ring-opacity-75 
                        ${
                          isLoading
                            ? `${loading} cursor-not-allowed opacity-75`
                            : ''
                        }`}
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 mr-3 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12c0-4.418 3.582-8 8-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
