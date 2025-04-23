
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  placeholder?: string;
}

export const SearchBox = ({ placeholder = "Search..." }: SearchBoxProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="search"
        className="block w-full p-2 pl-10 text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-brand-light focus:border-brand-light bg-white"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBox;
