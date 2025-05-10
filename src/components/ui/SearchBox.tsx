
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  size?: 'default' | 'mini';
}

export const SearchBox = ({ 
  placeholder = "Search...",
  value = "",
  onChange,
  onClear,
  className = "",
  size = "default"
}: SearchBoxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Search size={size === "mini" ? 16 : 18} />
      </div>
      <input
        type="search"
        className={`block w-full text-gray-800 border border-gray-200 rounded-lg focus:ring-brand-light focus:border-brand-light bg-white ${
          size === "mini" ? "p-1.5 pl-9 text-xs" : "p-2 pl-10 text-sm"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <X 
            size={size === "mini" ? 14 : 16} 
            className="text-gray-400 cursor-pointer hover:text-gray-600" 
            onClick={handleClear}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
