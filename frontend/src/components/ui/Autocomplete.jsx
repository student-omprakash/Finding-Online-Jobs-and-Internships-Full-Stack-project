import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Autocomplete = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = '',
    required = false,
    className = ''
}) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    // Update internal state if external value changes (e.g., initial load or reset)
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const userInput = e.target.value;
        setInputValue(userInput);

        // Filter options
        if (userInput.trim()) {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

        // Propagate change to parent
        // Create a synthetic event to match standard input behavior
        onChange({ target: { name, value: userInput } });
    };

    const handleSelectOption = (option) => {
        setInputValue(option);
        setShowDropdown(false);
        onChange({ target: { name, value: option } });
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label} {required && '*'}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (inputValue) setShowDropdown(true);
                    }}
                    placeholder={placeholder}
                    required={required}
                    className="block w-full border border-slate-300 rounded-md p-2 pr-10 focus:ring-primary-500 focus:border-primary-500"
                    autoComplete="off"
                />
                {/* Optional: Icon to indicate it's a dropdown-like input */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="text-gray-400" />
                </div>
            </div>

            {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectOption(option)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50 hover:text-primary-900 text-slate-900"
                        >
                            <span className="block truncate">
                                {option}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;
