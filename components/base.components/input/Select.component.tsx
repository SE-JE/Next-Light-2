import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  inputContainer,
  inputField,
  inputIcon,
  inputLabel,
  inputPadding,
  inputSuggest,
  inputSuggestContainer,
  inputTip,
} from './input.decorate';
import styles from './input.module.css';
import { useValidationHelper } from '../../../helpers';
import { selectOptionProps, selectProps } from './props/select.props';
import {
  faCheckCircle,
  faChevronDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export function SelectComponent({
  name,
  label,
  placeholder,
  disabled,
  value,
  options,
  onChange,
  onFocus,
  onBlur,
  error,
  size,
  leftIcon,
  validations,
  tip,
  searchable,
  multiple,
  register,
}: selectProps) {
  const [inputShowValue, setInputShowValue] = useState('');
  const [inputValue, setInputValue] = useState<
    string | string[] | number | number[]
  >('');
  const [isFocus, setIsFocus] = useState(false);
  const [isInvalid, setIsInvalid] = useState('');
  const [isFirst, setIsFirst] = useState(true);
  const [keydown, setKeydown] = useState(false);

  const [dataOptions, setDataOptions] = useState<selectOptionProps[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<selectOptionProps[]>(
    []
  );
  const [activeOption, setActiveOption] = useState(0);
  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    register?.(name, validations);
  }, [register, name, validations]);

  const [errorMessage] = useValidationHelper(
    {
      value: inputValue,
      rules: validations,
    },
    isFirst
  );

  // =========================>
  // ## Invalid handler
  // =========================>
  useEffect(() => {
    setIsInvalid(errorMessage || error || '');
  }, [error, errorMessage]);

  // =========================>
  // ## Change value handler
  // =========================>
  useEffect(() => {
    if (value) {
      setInputValue(value);
      setInputShowValue(
        dataOptions.find((option) => option.value == inputValue)?.label || ''
      );
      setIsFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dataOptions]);

  // =========================>
  // ## Option handler
  // =========================>
  useEffect(() => {
    setDataOptions(options);
  }, [options]);

  // =========================>
  // ## Options handler
  // =========================>
  const filterOption = (e: any) => {
    if (dataOptions?.length) {
      let newFilteredOptions: selectOptionProps[] = [];

      if (searchable) {
        if (e.target.value) {
          newFilteredOptions = dataOptions
            .filter(
              (Option) =>
                Option.label
                  .toLowerCase()
                  .indexOf(e.target.value.toLowerCase()) > -1
            )
            .slice(0, 10);
        } else {
          newFilteredOptions = dataOptions.slice(0, 10);
        }
      } else {
        newFilteredOptions = dataOptions;
      }

      setActiveOption(-1);
      setFilteredOptions(newFilteredOptions);
      setShowOption(true);
    }
  };

  const onKeyDownOption = (e: any) => {
    if (dataOptions?.length) {
      if (e.keyCode === 13) {
        let resultValue = filteredOptions?.at(activeOption);
        setActiveOption(-1);
        setFilteredOptions([]);
        setShowOption(false);
        if (!multiple) {
          setInputShowValue(resultValue?.label || inputShowValue);
          setInputValue(resultValue?.value || inputShowValue);
        } else {
          if (resultValue?.value) {
            searchable
              ? setInputShowValue(resultValue.label)
              : searchable && setInputShowValue('');

            const values: string[] = Array.isArray(inputValue)
              ? Array()
                  .concat(inputValue)
                  ?.filter((val: string | number) => val != resultValue?.value)
              : [];

            if (values.find((val) => val == resultValue?.value)) {
              setInputValue(values);
            } else {
              setInputValue([...Array().concat(values), resultValue.value]);
            }
          }
        }
        e.preventDefault();
      } else if (e.keyCode === 38) {
        if (activeOption === 0) return;
        setActiveOption(activeOption - 1);
      } else if (e.keyCode === 40) {
        if (activeOption + 1 >= (filteredOptions?.length || 0)) return;
        setActiveOption(activeOption + 1);
      }
    }
  };

  return (
    <>
      <div
        className={`
          ${inputContainer[size || 'md']}
        `}
      >
        {label && (
          <label
            htmlFor={`select_${name}`}
            className={`
              select-none
              ${inputLabel[size || 'md']}
              ${
                isFocus
                  ? 'text-primary'
                  : isInvalid
                  ? 'text-danger'
                  : 'text-slate-500'
              }
              ${disabled && 'opacity-60'}
            `}
          >
            {label}
          </label>
        )}

        {tip && (
          <small
            className={`
              ${inputTip[size || 'md']}
              ${styles.input__tip}
            `}
          >
            {tip}
          </small>
        )}
        <input
          type="hidden"
          value={
            !multiple
              ? String(inputValue)
              : Array()
                  .concat(inputValue)
                  .map((val) => String(val))
          }
          name={name}
        />
        <div className="relative overflow-hidden">
          <input
            type={'text'}
            className={`
              ${styles.input}
              ${isInvalid && styles.input__error}
              ${inputField[size || 'md']}
              ${inputPadding['right'][size || 'md']}
              ${leftIcon && inputPadding['left'][size || 'md']}
            `}
            readOnly={!searchable}
            placeholder={
              !inputValue || (Array.isArray(inputValue) && !inputValue.length)
                ? placeholder
                : ''
            }
            id={`select_${name}`}
            disabled={disabled}
            value={inputShowValue}
            onFocus={(e) => {
              setIsFocus(true);
              onFocus?.();
              dataOptions?.length && filterOption(e);
              searchable && e.target.select();
            }}
            onBlur={(e) => {
              const value = e.target.value;
              const valueOption = dataOptions.find(
                (option) => option.label?.toLowerCase() == value?.toLowerCase()
              );

              if (!keydown) {
                if (!multiple) {
                  setTimeout(() => {
                    if (valueOption?.value) {
                      setInputShowValue(valueOption.label);
                      setInputValue(valueOption.value);
                      onChange?.(valueOption.value);
                    } else {
                      setInputShowValue('');
                      setInputValue('');
                    }
                  }, 140);
                } else {
                  setInputShowValue('');
                }
              }

              setTimeout(() => {
                setIsFocus(false);
              }, 100);
              onBlur?.();
            }}
            onChange={(e) => {
              searchable && setInputShowValue(e.target.value);
              setIsFirst(false);
              !errorMessage && setIsInvalid('');
              onChange?.(e.target.value);
              dataOptions?.length && filterOption(e);
            }}
            onKeyDown={(e) => {
              dataOptions?.length && onKeyDownOption(e);
            }}
            autoComplete="off"
            autoFocus
          />

          {(!searchable || (searchable && !isFocus)) && (
            <div
              className={`
                absolute top-1/2 -translate-y-1/2 overflow-x-auto py-1.5
                ${leftIcon ? 'ml-[2.5rem]' : 'ml-2'}
                ${styles.input_scroll}
              `}
              style={{
                maxWidth: `calc(100% - ${leftIcon ? '5.2rem' : '3.2rem'})`,
              }}
            >
              <div
                className={`
                  ${styles.input_values_container}
                `}
              >
                {multiple &&
                  typeof inputValue != 'string' &&
                  Array()
                    .concat(inputValue)
                    ?.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className={`
                          ${styles.input_values_item}
                        `}
                        >
                          <span className="">
                            {
                              options.find((option) => option.value == item)
                                ?.label
                            }
                          </span>
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={`
                            ${styles.input_values_delete}
                          `}
                            onClick={() => {
                              const values = Array().concat(inputValue);
                              let index = values.findIndex(
                                (val: string | number) => val == item
                              );
                              setInputValue(
                                values.filter((_, val) => val != index)
                              );
                            }}
                          />
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {leftIcon && (
            <FontAwesomeIcon
              className={`
                ${styles.input__icon}
                ${inputIcon['left'][size || 'md']}
                ${
                  isFocus
                    ? 'text-primary'
                    : isInvalid
                    ? 'text-danger'
                    : 'text-slate-400'
                }
                ${disabled && 'opacity-60'}
              `}
              icon={leftIcon}
            />
          )}

          <label
            htmlFor={`select_${name}`}
            className={`
                cursor-pointer
                ${inputIcon['right'][size || 'md']}
                ${styles.input__icon}
            `}
          >
            <FontAwesomeIcon
              className={`
                ${
                  isFocus
                    ? 'text-primary'
                    : isInvalid
                    ? 'text-danger'
                    : 'text-slate-400'
                }
                ${disabled && 'opacity-60'}
              `}
              icon={faChevronDown}
            />
          </label>
        </div>

        {!!dataOptions?.length && showOption && !!filteredOptions?.length && (
          <div>
            <ul
              className={`
                  ${inputSuggestContainer[size || 'md']} 
                  ${isFocus ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
                  ${styles.input__suggest__container}
                `}
            >
              {filteredOptions.map((option, key) => {
                const selected =
                  !!(
                    (typeof inputValue == 'string' ||
                      typeof inputValue == 'number') &&
                    inputValue == option.value
                  ) ||
                  (Array.isArray(inputValue) &&
                    Array()
                      .concat(inputValue)
                      .find((val: string | number) => val == option.value));
                return (
                  <li
                    className={`
                        cursor-pointer hover:bg-light-primary
                        ${inputSuggest[size || 'md']} 
                        ${
                          (key == activeOption || selected) &&
                          'bg-light-primary text-primary'
                        }
                      `}
                    key={key}
                    onMouseDown={() => {
                      setKeydown(true);
                      setTimeout(() => setIsFocus(true), 110);
                    }}
                    onMouseUp={() => {
                      setKeydown(false);
                      setActiveOption(key);
                      setFilteredOptions([]);
                      setShowOption(false);
                      if (!multiple) {
                        setInputShowValue(option.label);
                        setInputValue(option.value);
                        onChange?.(option.value);
                      } else {
                        const values: string[] | number[] = Array.isArray(
                          inputValue
                        )
                          ? Array()
                              .concat(inputValue)
                              .filter((val) => val != option.value)
                          : [];
                        setInputShowValue('');
                        if (
                          Array.isArray(inputValue) &&
                          Array()
                            .concat(inputValue)
                            .find((val) => val == option.value)
                        ) {
                          setInputValue(values);
                        } else {
                          setInputValue([
                            ...Array().concat(values),
                            option.value,
                          ]);
                        }

                        onChange?.(values);
                      }
                      setTimeout(() => setIsFocus(false), 120);
                    }}
                  >
                    {selected && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="mr-2 text-sm"
                      />
                    )}
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isInvalid && (
          <small
            className={`
              overflow-x-hidden
              ${styles.input__error__message}
              ${
                size == 'lg'
                  ? 'text-sm'
                  : size == 'sm'
                  ? 'text-[9px]'
                  : 'text-xs'
              }
            `}
          >
            {isInvalid}
          </small>
        )}
      </div>
    </>
  );
}
