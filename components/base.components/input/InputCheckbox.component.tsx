import React, { useEffect, useState } from 'react';
import { CheckboxComponent } from './Checkbox.component';
import { inputContainer, inputField, inputLabel } from './input.decorate';
import styles from './input.module.css';
import { inputCheckboxProps } from './props/input-checkbox.props';

export function InputCheckboxComponent({
  name,
  label,
  size,
  disabled,
  options,
  vertical,
  value,
  onChange,
  register,
  validations,
}: inputCheckboxProps) {
  const [inputValue, setInputValue] = useState<string[] | number[]>([]);

  useEffect(() => {
    register?.(name, validations);
  }, [register, name, validations]);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    } else {
      setInputValue([]);
    }
  }, [value]);

  return (
    <>
      <div
        className={`
          ${inputContainer}
        `}
      >
        <label
          htmlFor={`input_${name}`}
          className={`
            select-none
            ${inputLabel[size || 'md']}
            ${disabled && 'opacity-60'}
          `}
        >
          {label}
        </label>

        <div
          className={`
            overflow-auto
            ${styles.input}
            ${inputField['md']}
            ${styles.input_scroll}
            ${disabled && 'opacity-60'}
          `}
        >
          <div
            className={`
              w-full flex gap-3 -ml-2
              ${vertical && 'flex-col'}
            `}
          >
            {options?.map((option, key) => {
              const checked = Array()
                .concat(inputValue)
                .find((val) => val == option.value);
              return (
                <CheckboxComponent
                  key={key}
                  label={option.label}
                  name={'option_' + option.value}
                  checked={!!checked}
                  disabled={disabled}
                  size={size}
                  onChange={() => {
                    let newVal: string[] | number[] = [];
                    if (checked) {
                      newVal = Array()
                        .concat(inputValue)
                        .filter((val) => val != option.value);
                    } else {
                      newVal = [
                        ...Array()
                          .concat(inputValue)
                          .filter((val) => val != option.value),
                        option.value,
                      ];
                    }

                    setInputValue(newVal);
                    onChange?.(newVal);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
