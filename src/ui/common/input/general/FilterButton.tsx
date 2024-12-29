import React, { useState, useRef, useEffect } from 'react';
import { FilterProps } from '../../../Types';
import Button from '../controlled/Button';

interface FilterButtonProps {
  options: FilterProps[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

export default function FilterButton({ options, selectedOptions, onChange }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownAbove, setDropdownAbove] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
        setDropdownAbove(true);
      } else {
        setDropdownAbove(false);
      }
    }
  }, [isOpen]);

  const handleToggleOption = (option: FilterProps) => {
    const currentIndex = selectedOptions.indexOf(option.value);
    const newSelectedOptions = [...selectedOptions];
    console.log('TOGGLE OPTION', option, currentIndex);
    if (currentIndex === -1) {
      newSelectedOptions.push(option.value);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    onChange(newSelectedOptions);
  };

  return (
    <div className='filter-button'>
      <button ref={buttonRef} onClick={handleToggleDropdown}>
        Filter
      </button>
      {isOpen && (
        <div ref={dropdownRef} className={`dropdown ${dropdownAbove ? 'above' : 'below'}`}>
          {options.map((option) => (
            <>
              <Button
                className='dropdown-item'
                width='25vw'
                label={option.label}
                onClick={() => handleToggleOption(option)}
                icon={option.icon}
                iconSize='3rem'
                iconPosition='left'
                color={
                  selectedOptions.indexOf(option.value) === -1
                    ? 'var(--color-background-far)'
                    : 'var(--button-background-color)'
                }
              />
            </>
          ))}
        </div>
      )}
      <style>{`
        .filter-button {
          position: relative;
          display: inline-block;
        }
        .dropdown {
          position: absolute;
          background-color: var(--color-background-far);
          border: 1px solid #ccc;
          border-radius:var(--interactive-radius);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 9;
          margin-top: 5px;
        }
        .dropdown.above {
          bottom: 100%;
          margin-bottom: 5px;
        }
        .dropdown.below {
          top: 100%;
          margin-top: 5px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 5px 10px;
        }
        .dropdown-item:hover {
          background-color: var(--color-background-near);
        }
        .dropdown-item input {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
